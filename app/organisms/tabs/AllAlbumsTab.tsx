import React, { FC } from 'react';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import Button from '../../atoms/Button';
import { useSetRouteKey } from '../../contexts/RouteContext';

const AllAlbumsTab: FC = () => {
  const albumList = useAsyncMemo(() => Database.selectAlbumList(), [], []);
  const setAlbumId = useSetRouteKey('album');

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {albumList.map((album) => (
          <div
            key={album.itemId}
            style={{ display: 'inline-block', margin: 10 }}
          >
            <Button
              onClick={() => setAlbumId(album.itemId)}
              key={album.itemId}
              type="button"
            >
              {album.title}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AllAlbumsTab;
