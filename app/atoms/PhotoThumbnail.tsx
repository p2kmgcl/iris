import React, { FC, useState } from 'react';
import { LoadedPhoto } from '../utils/PhotoLoader';
import styles from './PhotoThumbnail.css';
import { MdLocalMovies } from 'react-icons/all';
import { Album } from '../../types/Schema';
import PhotoModal from '../organisms/modals/PhotoModal';

const PhotoThumbnail: FC<{ photo: LoadedPhoto; album?: Album | null }> = ({
  photo,
  album = null,
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {openModal ? (
        <PhotoModal
          photo={photo}
          album={album}
          onCloseButtonClick={() => setOpenModal(false)}
        />
      ) : null}

      <button className={styles.button} onClick={() => setOpenModal(true)}>
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
    </>
  );
};

export default PhotoThumbnail;
