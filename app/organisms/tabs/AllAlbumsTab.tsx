import React, { FC, useCallback, useState } from 'react';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import AlbumModal from '../modals/AlbumModal';
import CardGrid from '../../atoms/CardGrid';

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

      <CardGrid cards={albumList} onCardClick={setAlbumId} />
    </div>
  );
};

export default AllAlbumsTab;
