import React, { FC, useCallback } from 'react';
import { Album } from '../../../types/Schema';
import Modal from '../../atoms/Modal';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import Grid, { ItemProps } from '../../atoms/Grid';
import PhotoLoader from '../../utils/PhotoLoader';

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
    ({ index }: ItemProps) => {
      const photo = useAsyncMemo(
        () => PhotoLoader.fromIndex(index, album.itemId),
        [index, album.itemId],
        null,
      );

      return photo ? (
        <div
          style={{
            backgroundImage: `url(${photo.thumbnailURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            width: '100%',
            height: '100%',
          }}
        />
      ) : null;
    },
    [album.itemId],
  );

  return (
    <Modal onCloseButtonClick={onCloseButtonClick}>
      <header style={{ padding: '1em' }}>
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
