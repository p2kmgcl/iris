import { FC, useMemo } from 'react';
import Modal from '../../atoms/Modal';
import Slides, { SlideProps } from '../../atoms/Slides';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import { PhotoModel } from '../../../types/Schema';
import PhotoLoader from '../../utils/PhotoLoader';
import styles from './PhotoModal.css';

const PhotoSlide: FC<SlideProps> = ({
  itemId,
  slideHeight: maxHeight,
  slideWidth: maxWidth,
}) => {
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

  if (!photo || !thumbnailURL) {
    return null;
  }

  return (
    <div className={styles.photoSlide}>
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
        <Slides
          slideIdList={photoKeyList}
          initialSlideId={photoId}
          Slide={PhotoSlide}
        />
      ) : null}
    </Modal>
  );
};

export default PhotoModal;
