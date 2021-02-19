import React, { FC } from 'react';
import Modal from '../../atoms/Modal';
import { LoadedPhoto } from '../../utils/PhotoLoader';
import { Album } from '../../../types/Schema';

const PhotoModal: FC<{
  photo: LoadedPhoto;
  onCloseButtonClick: () => void;
  album?: Album | null;
}> = ({ photo, onCloseButtonClick, album = null }) => {
  return (
    <Modal background="black" onCloseButtonClick={onCloseButtonClick}>
      <span>{album?.title}</span>
      <img src={photo.thumbnailURL} />
    </Modal>
  );
};

export default PhotoModal;
