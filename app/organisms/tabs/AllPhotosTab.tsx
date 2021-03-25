import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import { Grid, ItemProps } from '../../atoms/Grid';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import PhotoThumbnail from '../../atoms/PhotoThumbnail';
import PhotoModal from '../modals/PhotoModal';

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

      <Grid
        itemIdList={photoKeyList}
        itemProps={{ setPhotoId }}
        itemMaxSize={256}
        minColumnCount={3}
        itemSizeRatio={1}
        Item={Photo}
      />
    </>
  );
};

export default AllPhotosTab;
