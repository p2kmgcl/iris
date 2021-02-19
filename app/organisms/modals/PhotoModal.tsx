import React, { FC, useMemo, useState } from 'react';
import Modal from '../../atoms/Modal';
import PhotoLoader, { LoadedPhoto } from '../../utils/PhotoLoader';
import { Album } from '../../../types/Schema';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import styles from './PhotoModal.css';

const PhotoModal: FC<{
  photo: LoadedPhoto;
  onCloseButtonClick: () => void;
  album: Album | null;
}> = ({ photo, onCloseButtonClick }) => {
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);

  const wrapperSize = useMemo(() => {
    if (!wrapper) return { width: 0, height: 0 };
    return wrapper.getBoundingClientRect();
  }, [wrapper]);

  return (
    <Modal background="black" onCloseButtonClick={onCloseButtonClick}>
      <div className={styles.wrapper} ref={setWrapper}>
        <PhotoSlide
          photo={photo}
          maxWidth={wrapperSize.width}
          maxHeight={wrapperSize.height}
        />
      </div>
    </Modal>
  );
};

const PhotoSlide: FC<{
  photo: LoadedPhoto;
  maxWidth: number;
  maxHeight: number;
}> = ({ photo, maxHeight, maxWidth }) => {
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
  }, [maxWidth, maxHeight]);

  return photo.isVideo ? (
    <video
      src={url}
      controls
      autoPlay
      loop
      poster={photo.thumbnailURL}
      width={width}
      height={height}
    />
  ) : (
    <img src={url || photo.thumbnailURL} width={width} height={height} />
  );
};

export default PhotoModal;
