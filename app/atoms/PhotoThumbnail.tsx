import React, { FC } from 'react';
import styles from './PhotoThumbnail.css';
import { MdLocalMovies } from 'react-icons/md';

const PhotoThumbnail: FC<{
  url: string;
  onClick: () => void;
  showVideoIcon: boolean;
}> = ({ url, onClick, showVideoIcon }) => {
  return (
    <button className={styles.button} onClick={() => onClick()}>
      <div
        role="img"
        className={styles.thumbnail}
        style={{ backgroundImage: `url(${url})` }}
      />

      {showVideoIcon ? (
        <div className={styles.icon}>
          <MdLocalMovies />
        </div>
      ) : null}
    </button>
  );
};

export default PhotoThumbnail;
