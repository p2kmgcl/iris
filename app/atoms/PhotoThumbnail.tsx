import { FC, useMemo } from 'react';
import styles from './PhotoThumbnail.module.css';
import { MdLocalMovies } from 'react-icons/md';
import { PhotoModel } from '../../types/Schema';
import PhotoLoader from '../utils/PhotoLoader';

const PhotoThumbnail: FC<{
  photoItem: PhotoModel;
  onClick: () => void;
}> = ({ photoItem, onClick }) => {
  const url = useMemo(
    () => PhotoLoader.getPhotoThumbnailURL(photoItem.itemId),
    [photoItem],
  );

  return (
    <button className={styles.button} onClick={() => onClick()}>
      <div
        role="img"
        className={styles.thumbnail}
        style={{ backgroundImage: `url(${url})` }}
      />

      {photoItem.isVideo ? (
        <div className={styles.icon}>
          <MdLocalMovies />
        </div>
      ) : null}
    </button>
  );
};

export default PhotoThumbnail;
