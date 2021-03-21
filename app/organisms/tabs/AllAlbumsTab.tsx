import { FC, useCallback, useState } from 'react';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import AlbumModal from '../modals/AlbumModal';
import { Grid, ItemProps } from '../../atoms/Grid';
import { Card } from '../../atoms/Card';

const Album: FC<ItemProps & { setAlbumId: (albumId: string) => void }> = ({
  itemId,
  setAlbumId,
}) => {
  const album = useAsyncMemo(
    () => Database.selectAlbum(itemId),
    [itemId],
    undefined,
  );

  if (!album) {
    return null;
  }

  return (
    <Card
      thumbnailURL={`/thumbnail?itemId=${album.coverItemId}`}
      title={album.title}
      onClick={() => setAlbumId(itemId)}
    />
  );
};

const AllAlbumsTab: FC = () => {
  const albumKeyList = useAsyncMemo(
    () => Database.selectAlbumKeyList(),
    [],
    [],
  );
  const [albumId, setAlbumId] = useState('');

  const handleCloseButtonClick = useCallback(() => {
    setAlbumId('');
  }, []);

  return (
    <>
      {albumId ? (
        <AlbumModal
          albumId={albumId}
          onCloseButtonClick={handleCloseButtonClick}
        />
      ) : null}

      <Grid
        itemIdList={albumKeyList}
        itemSizeRatio={1.25}
        minColumnCount={2}
        itemMaxSize={300}
        itemProps={{ setAlbumId }}
        Item={Album}
      />
    </>
  );
};

export default AllAlbumsTab;
