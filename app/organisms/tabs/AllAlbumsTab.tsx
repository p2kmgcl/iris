import React, { FC, useState } from 'react';
import { useAsyncMemo } from '../../hooks/useAsyncMemo';
import { Database } from '../../utils/Database';
import { Dialog } from '@material-ui/core';
import { Album } from '../../../types/Schema';
import { CloseOutlined } from '@material-ui/icons';
import { PhotoGrid } from '../../atoms/PhotoGrid';
import { Button } from '../../atoms/Button';

export const AllAlbumsTab: FC = () => {
  const albumList = useAsyncMemo(() => Database.selectAlbumList(), [], []);
  const [album, setAlbum] = useState<Album | null>(null);

  return (
    <div>
      <Dialog fullScreen open={!!album}>
        {album ? (
          <>
            <Button onClick={() => setAlbum(null)} type="button">
              <CloseOutlined />
            </Button>

            {isFinite(album.dateTime) ? (
              <p>{new Date(album.dateTime).toLocaleDateString()}</p>
            ) : null}
            <h1>{album.title}</h1>

            <PhotoGrid albumItemId={album.itemId} />
          </>
        ) : null}
      </Dialog>

      {albumList.map((album) => (
        <Button
          onClick={() => setAlbum(album)}
          key={album.itemId}
          type="button"
        >
          {album.title}
        </Button>
      ))}
    </div>
  );
};
