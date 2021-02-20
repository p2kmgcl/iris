import React, { FC } from 'react';
import { LoadedPhoto } from '../utils/PhotoLoader';
import styles from './PhotoThumbnail.css';
import { MdLocalMovies } from 'react-icons/all';
import { useSetRouteKey } from '../contexts/RouteContext';

const PhotoThumbnail: FC<{
  photo: LoadedPhoto;
  index: number;
}> = ({ photo, index }) => {
  const setPhotoIndex = useSetRouteKey('photo');

  return (
    <button
      className={styles.button}
      onClick={() => setPhotoIndex(index.toString())}
    >
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
    </button>
  );
};

export default PhotoThumbnail;
