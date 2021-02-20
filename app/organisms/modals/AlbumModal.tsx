import React, { FC, useCallback } from 'react';
import { Album } from '../../../types/Schema';
import Modal from '../../atoms/Modal';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import Grid, { ItemProps } from '../../atoms/Grid';
import PhotoLoader from '../../utils/PhotoLoader';
import PhotoThumbnail from '../../atoms/PhotoThumbnail';

const AlbumModal: FC<{
  album: Album;
  onCloseButtonClick: () => void;
}> = ({ album, onCloseButtonClick }) => {
  const photoCount = useAsyncMemo<number>(
    () => Database.selectPhotoCount(album.itemId),
    [album.itemId],
    0,
  );

  const Photo = useCallback(
    function PhotoCallback({ index }: ItemProps) {
      const photo = useAsyncMemo(
        () => PhotoLoader.getLoadedPhotoFromIndex(index, album.itemId),
        [index, album.itemId],
        null,
      );

      return photo ? (
        <PhotoThumbnail index={index} photo={photo} album={album} />
      ) : null;
    },
    [album.itemId],
  );

  return (
    <Modal onCloseButtonClick={onCloseButtonClick}>
      <header style={{ padding: '3em 1em 1em 1em' }}>
        {isFinite(album.dateTime) ? (
          <p>{new Date(album.dateTime).toLocaleDateString()}</p>
        ) : null}
        <h1>{album.title}</h1>
      </header>

      <Grid itemCount={photoCount} Item={Photo} />
    </Modal>
  );
};

export default AlbumModal;
