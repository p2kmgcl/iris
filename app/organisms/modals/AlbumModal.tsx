import { Dispatch, FC, SetStateAction, useState } from 'react';
import Modal from '../../atoms/Modal';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import Grid, { ItemProps } from '../../atoms/Grid';
import PhotoThumbnail from '../../atoms/PhotoThumbnail';
import PhotoModal from './PhotoModal';
import { usePhotoThumbnail } from '../../hooks/usePhotoThumbnail';

interface PhotoProps {
  setPhotoId: Dispatch<SetStateAction<string>>;
}

const Photo = function ({ itemId, setPhotoId }: ItemProps & PhotoProps) {
  const url = usePhotoThumbnail(itemId);

  const showVideoIcon = useAsyncMemo(
    () => Database.selectPhoto(itemId).then((photo) => photo?.isVideo || false),
    [itemId],
    false,
  );

  return url ? (
    <PhotoThumbnail
      url={url}
      onClick={() => setPhotoId(itemId)}
      showVideoIcon={showVideoIcon}
    />
  ) : null;
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
          <p>{new Date(album.dateTime).toLocaleDateString()}</p>
        ) : null}
        <h1>{album.title}</h1>
      </header>

      <Grid itemIdList={photoKeyList} itemProps={{ setPhotoId }} Item={Photo} />
    </Modal>
  );
};

export default AlbumModal;
