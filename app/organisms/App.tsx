import React, { useEffect, useState } from 'react';
import { Button } from '../atoms/Button';
import { Authentication } from '../utils/Authentication';
import { Database } from '../utils/Database';
import { AbortError, Scanner } from '../utils/Scanner';
import { Photo } from '../../types/Schema';
import { PhotoGrid } from '../atoms/PhotoGrid';

export function App() {
  const [loading, setLoading] = useState(false);
  const [scan, setScan] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (!scan) {
      return;
    }

    const abortController = new AbortController();

    Database.getConfiguration()
      .then(({ rootDirectoryId }) => {
        return Scanner.scan(
          rootDirectoryId,
          abortController.signal,
          async () => {},
        );
      })
      .then(() => {
        setScan(false);
      })
      .catch((error) => {
        if (!(error instanceof AbortError)) {
          throw error;
        }
      });

    return () => {
      abortController.abort();
    };
  }, [scan]);

  useEffect(() => {
    Database.selectPhotos().then(setPhotos);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}
    >
      <Button
        onClick={() => {
          setLoading(true);
          Authentication.logout();
        }}
        variant="primary"
        loading={loading}
      >
        Logout
      </Button>
      <Button onClick={() => setScan(!scan)}>
        {scan ? 'Stop scanning' : 'Start scanning'}
      </Button>
      <PhotoGrid photos={photos} />
    </div>
  );
}
