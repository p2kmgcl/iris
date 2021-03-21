import { FC, useCallback, useMemo, useState } from 'react';
import Modal from '../../atoms/Modal';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import { PhotoModel } from '../../../types/Schema';
import PhotoLoader from '../../utils/PhotoLoader';
import styles from './PhotoModal.module.css';
import { Carousel, SlideProps } from '../../atoms/Carousel';

const PhotoSlide: FC<SlideProps> = ({ slideId: itemId }) => {
  const [
    { width: maxWidth, height: maxHeight },
    setPhotoSlideClientRect,
  ] = useState({
    width: 0,
    height: 0,
  });

  const photo = useAsyncMemo<PhotoModel | undefined>(
    () => Database.selectPhoto(itemId),
    [itemId],
    undefined,
  );

  const thumbnailURL = PhotoLoader.getPhotoThumbnailURL(itemId);

  const url = useAsyncMemo(
    async () => {
      const nextURL = await PhotoLoader.getDownloadURLFromItemId(itemId);
      const image = document.createElement('img');
      const imageLoadPromise = new Promise<void>((resolve) => {
        image.addEventListener('load', () => resolve());
      });

      image.src = nextURL;
      await imageLoadPromise;
      return nextURL;
    },
    [itemId],
    '',
  );

  const [width, height] = useMemo(() => {
    if (!photo) {
      return [0, 0];
    }

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
  }, [maxWidth, maxHeight, photo]);

  const handlePhotoSlideRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      setPhotoSlideClientRect(element.getBoundingClientRect());
    }
  }, []);

  if (!photo || !thumbnailURL) {
    return null;
  }

  return (
    <div className={styles.photoSlide} ref={handlePhotoSlideRef}>
      <div>
        <div>
          {new Date(photo.dateTime).toLocaleString(
            navigator.language || 'en-US',
            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
          )}
        </div>

        {photo.isVideo ? (
          <video
            loop
            src={url}
            controls
            poster={thumbnailURL}
            width={width}
            height={height}
          />
        ) : (
          <img src={url || thumbnailURL} width={width} height={height} />
        )}
      </div>
    </div>
  );
};

const PhotoModal: FC<{
  albumId?: string;
  photoId: string;
  onCloseButtonClick: () => void;
}> = ({ albumId, photoId, onCloseButtonClick }) => {
  const photoKeyList = useAsyncMemo(
    () => Database.selectPhotoKeyList(albumId),
    [albumId],
    [],
  );

  return (
    <Modal
      priority={2}
      background="black"
      onCloseButtonClick={onCloseButtonClick}
    >
      {photoKeyList.length ? (
        <Carousel
          slideIdsList={photoKeyList}
          initialSlideId={photoId}
          Slide={PhotoSlide}
        />
      ) : null}
    </Modal>
  );
};

export default PhotoModal;
