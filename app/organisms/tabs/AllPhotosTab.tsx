import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import Grid, { ItemProps } from '../../atoms/Grid';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import PhotoThumbnail from '../../atoms/PhotoThumbnail';
import PhotoModal from '../modals/PhotoModal';
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

const AllPhotosTab: FC = () => {
  const [photoId, setPhotoId] = useState('');

  const photoKeyList = useAsyncMemo<string[]>(
    () => Database.selectPhotoKeyList(),
    [],
    [],
  );

  const handleCloseButtonClick = useCallback(() => {
    setPhotoId('');
  }, []);

  return (
    <>
      {photoId ? (
        <PhotoModal
          photoId={photoId}
          onCloseButtonClick={handleCloseButtonClick}
        />
      ) : null}

      <Grid itemIdList={photoKeyList} itemProps={{ setPhotoId }} Item={Photo} />
    </>
  );
};

export default AllPhotosTab;
