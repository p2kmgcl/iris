import { Dispatch, FC, SetStateAction, useState } from 'react';
import Modal from '../../atoms/Modal';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import { Grid, ItemProps } from '../../atoms/Grid';
import PhotoThumbnail from '../../atoms/PhotoThumbnail';
import PhotoModal from './PhotoModal';

interface PhotoProps {
  setPhotoId: Dispatch<SetStateAction<string>>;
}

const Photo = function ({ itemId, setPhotoId }: ItemProps & PhotoProps) {
  const photoItem = useAsyncMemo(
    () => Database.selectPhoto(itemId),
    [itemId],
    undefined,
  );

  if (!photoItem) {
    return null;
  }

  return (
    <PhotoThumbnail photoItem={photoItem} onClick={() => setPhotoId(itemId)} />
  );
};

const AlbumModal: FC<{
  albumId: string;
  onCloseButtonClick: () => void;
}> = ({ albumId, onCloseButtonClick }) => {
  const [photoId, setPhotoId] = useState('');

  const album = useAsyncMemo(
    () => (albumId ? Database.selectAlbum(albumId) : Promise.resolve(null)),
    [albumId],
    null,
  );

  const photoKeyList = useAsyncMemo<string[]>(
    () => Database.selectPhotoKeyList(albumId),
    [albumId],
    [],
  );

  if (!album) {
    return null;
  }

  return (
    <Modal priority={1} onCloseButtonClick={onCloseButtonClick}>
      {photoId ? (
        <PhotoModal
          albumId={albumId}
          photoId={photoId}
          onCloseButtonClick={() => setPhotoId('')}
        />
      ) : null}

      <header style={{ padding: '3em 1em 1em 1em' }}>
        {isFinite(album.dateTime) ? (
          <p>
            {new Date(album.dateTime).toLocaleDateString(
              navigator.language || 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' },
            )}
          </p>
        ) : null}
        <h1>{album.title}</h1>
      </header>

      <Grid
        itemIdList={photoKeyList}
        itemSizeRatio={1}
        minColumnCount={3}
        itemMaxSize={256}
        itemProps={{ setPhotoId }}
        Item={Photo}
      />
    </Modal>
  );
};

export default AlbumModal;
