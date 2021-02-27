import React, { FC, useCallback, useState } from 'react';
import Modal from '../../atoms/Modal';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import Grid, { ItemProps } from '../../atoms/Grid';
import PhotoLoader from '../../utils/PhotoLoader';
import PhotoThumbnail from '../../atoms/PhotoThumbnail';
import PhotoModal from './PhotoModal';

const AlbumModal: FC<{
  albumId: string;
  onCloseButtonClick: () => void;
}> = ({ albumId, onCloseButtonClick }) => {
  const [photoIndex, setPhotoIndex] = useState(-1);

  const album = useAsyncMemo(
    () => (albumId ? Database.selectAlbum(albumId) : Promise.resolve(null)),
    [albumId],
    null,
  );

  const photoCount = useAsyncMemo<number>(
    () => Database.selectPhotoCount(albumId),
    [albumId],
    0,
  );

  const Photo = useCallback(
    function PhotoCallback({ index }: ItemProps) {
      const photo = useAsyncMemo(
        () => PhotoLoader.getLoadedPhotoFromIndex(index, albumId),
        [index, albumId],
        null,
      );

      return photo ? (
        <PhotoThumbnail
          url={photo.thumbnailURL}
          onClick={() => setPhotoIndex(index)}
          showVideoIcon={photo.isVideo}
        />
      ) : null;
    },
    [albumId, setPhotoIndex],
  );

  if (!album) {
    return null;
  }

  return (
    <Modal priority={1} onCloseButtonClick={onCloseButtonClick}>
      {photoIndex !== -1 ? (
        <PhotoModal
          albumId={albumId}
          initialIndex={photoIndex}
          onCloseButtonClick={() => setPhotoIndex(-1)}
        />
      ) : null}

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
