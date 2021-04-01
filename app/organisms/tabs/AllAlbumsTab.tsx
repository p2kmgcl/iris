import { FC, useCallback, useState } from 'react';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import AlbumModal from '../modals/AlbumModal';
import { Grid, ItemProps } from '../../atoms/Grid';
import { Card } from '../../atoms/Card';
import { AlbumModel } from '../../../types/Schema';

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
  const albumGroups = useAsyncMemo(
    async () => {
      const albumList = await Database.selectAlbumList();
      const albumGroups: Record<string, AlbumModel[]> = {};

      for (const album of albumList) {
        const category = isFinite(album.dateTime)
          ? new Date(album.dateTime).getFullYear().toString()
          : 'No date';

        albumGroups[category] = albumGroups[category] || [];
        albumGroups[category].push(album);
      }

      return albumGroups;
    },
    [],
    {},
  );

  console.log(albumGroups);

  const albumKeyList = useAsyncMemo(
    async () => {
      const albumList = await Database.selectAlbumList();
      return albumList.map((album) => album.itemId);
    },
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
