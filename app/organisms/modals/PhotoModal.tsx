import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '../../atoms/Modal';
import PhotoLoader, { LoadedPhoto } from '../../utils/PhotoLoader';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import styles from './PhotoModal.css';
import HorizontalList from '../../atoms/HorizontalList';
import Database from '../../utils/Database';
import LoadingMask from '../../atoms/LoadingMask';
import { useSetRouteKey } from '../../contexts/RouteContext';

const PhotoModal: FC<{
  index: number;
  albumId: string | null;
  onCloseButtonClick: () => void;
}> = ({ index, albumId = null, onCloseButtonClick }) => {
  const setIndex = useSetRouteKey('photo');

  const photoCount = useAsyncMemo<number>(
    () => Database.selectPhotoCount(albumId),
    [albumId],
    0,
  );

  const PhotoCallback = useCallback(
    ({ index, itemHeight, itemWidth, isVisible }) => {
      const photo = useAsyncMemo(
        () => PhotoLoader.getLoadedPhotoFromIndex(index, albumId),
        [index, albumId],
        null,
      );

      return photo ? (
        <PhotoSlide
          photo={photo}
          maxWidth={itemWidth}
          maxHeight={itemHeight}
          isVisible={isVisible}
        />
      ) : null;
    },
    [albumId],
  );

  const handleIndexChange = useCallback(
    (nextIndex: number) => {
      setIndex(nextIndex.toString());
    },
    [setIndex],
  );

  return (
    <Modal
      priority={2}
      background="black"
      onCloseButtonClick={onCloseButtonClick}
    >
      <HorizontalList
        itemCount={photoCount}
        Item={PhotoCallback}
        index={index}
        onIndexChange={handleIndexChange}
      />
    </Modal>
  );
};

const PhotoSlide: FC<{
  photo: LoadedPhoto;
  maxWidth: number;
  maxHeight: number;
  isVisible: boolean;
}> = ({ photo, maxHeight, maxWidth, isVisible }) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );

  const url = useAsyncMemo(
    () => PhotoLoader.getDownloadURLFromItemId(photo.itemId),
    [photo.itemId],
    '',
  );

  const [width, height] = useMemo(() => {
    let width = photo.width;
    let height = photo.height;
    let ratio = 0;

    if (width > maxWidth) {
      ratio = maxWidth / width;
      width *= ratio;
      height *= ratio;
    }

    if (height > maxHeight) {
      ratio = maxHeight / height;
      width *= ratio;
      height *= ratio;
    }

    return [width, height];
  }, [maxWidth, maxHeight, photo.width, photo.height]);

  useEffect(() => {
    if (videoElement) {
      if (isVisible) {
        videoElement.play().catch(() => {});
      } else {
        videoElement.pause();
      }
    }
  }, [videoElement, isVisible]);

  return (
    <div className={styles.photoSlide}>
      <LoadingMask loading={!url}>
        {photo.isVideo ? (
          <video
            loop
            src={url}
            controls
            poster={photo.thumbnailURL}
            width={width}
            height={height}
            ref={setVideoElement}
          />
        ) : (
          <img src={url || photo.thumbnailURL} width={width} height={height} />
        )}
      </LoadingMask>
    </div>
  );
};

export default PhotoModal;
