import React, { FC } from 'react';
import { Album } from '../../../types/Schema';
import Modal from '../../atoms/Modal';
import Button from '../../atoms/Button';
import PhotoGrid from '../../atoms/PhotoGrid';
import { AiOutlineClose } from 'react-icons/ai';

const AlbumModal: FC<{
  album: Album;
  onCloseButtonClick: () => void;
}> = ({ album, onCloseButtonClick }) => (
  <Modal>
    <Button onClick={() => onCloseButtonClick()} type="button">
      <AiOutlineClose />
    </Button>

    {isFinite(album.dateTime) ? (
      <p>{new Date(album.dateTime).toLocaleDateString()}</p>
    ) : null}
    <h1>{album.title}</h1>

    <PhotoGrid albumItemId={album.itemId} />
  </Modal>
);

export default AlbumModal;
