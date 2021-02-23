import React, { FC } from 'react';
import { LoadedPhotoModel } from '../../types/LoadedPhotoModel';
import styles from './PhotoThumbnail.css';
import { useSetRouteKey } from '../contexts/RouteContext';
import { MdLocalMovies } from 'react-icons/md';

const PhotoThumbnail: FC<{
  photo: LoadedPhotoModel;
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
