import React, { FC, useState } from 'react';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import { Album } from '../../../types/Schema';
import Button from '../../atoms/Button';
import AlbumModal from '../modals/AlbumModal';

const AllAlbumsTab: FC = () => {
  const albumList = useAsyncMemo(() => Database.selectAlbumList(), [], []);
  const [album, setAlbum] = useState<Album | null>(null);

  return (
    <>
      {album ? (
        <AlbumModal album={album} onCloseButtonClick={() => setAlbum(null)} />
      ) : null}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {albumList.map((album) => (
          <div style={{ display: 'inline-block', margin: 10 }}>
            <Button
              onClick={() => setAlbum(album)}
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
