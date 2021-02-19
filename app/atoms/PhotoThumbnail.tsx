import React, { FC } from 'react';
import { LoadedPhoto } from '../utils/PhotoLoader';
import styles from './PhotoThumbnail.css';
import { MdLocalMovies } from 'react-icons/all';

const PhotoThumbnail: FC<{ photo: LoadedPhoto }> = ({ photo }) => {
  return (
    <div className={styles.wrapper}>
      <div
        role="img"
        className={styles.thumbnail}
        style={{ backgroundImage: `url(${photo.thumbnailURL})` }}
      />

      {photo.isVideo ? (
        <div className={styles.icon}>
          <MdLocalMovies />
        </div>
      ) : null}
    </div>
  );
};

export default PhotoThumbnail;
