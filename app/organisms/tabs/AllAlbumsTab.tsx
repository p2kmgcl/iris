import React, { FC, useCallback, useState } from 'react';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import Button from '../../atoms/Button';
import AlbumModal from '../modals/AlbumModal';

const AllAlbumsTab: FC = () => {
  const albumList = useAsyncMemo(() => Database.selectAlbumList(), [], []);
  const [albumId, setAlbumId] = useState('');

  const handleCloseButtonClick = useCallback(() => {
    setAlbumId('');
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {albumId ? (
        <AlbumModal
          albumId={albumId}
          onCloseButtonClick={handleCloseButtonClick}
        />
      ) : null}

      {albumList.map((album) => (
        <div key={album.itemId} style={{ display: 'inline-block', margin: 10 }}>
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
  );
};

export default AllAlbumsTab;
