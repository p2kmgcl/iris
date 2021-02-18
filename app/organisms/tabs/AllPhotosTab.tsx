import React, { FC, useCallback } from 'react';
import Grid, { ItemProps } from '../../atoms/Grid';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import PhotoLoader from '../../utils/PhotoLoader';
import { useScanStatus } from '../../contexts/ScanContext';

const AllPhotosTab: FC = () => {
  const scanTrigger = useScanStatus();

  const photoCount = useAsyncMemo<number>(
    () => Database.selectPhotoCount(),
    [scanTrigger],
    0,
  );

  const Photo = useCallback(({ index }: ItemProps) => {
    const photo = useAsyncMemo(
      () => PhotoLoader.fromIndex(index),
      [index],
      null,
    );

    return photo ? (
      <div
        style={{
          backgroundImage: `url(${photo.thumbnailURL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          width: '100%',
          height: '100%',
        }}
      />
    ) : null;
  }, []);

  return <Grid itemCount={photoCount} Item={Photo} />;
};

export default AllPhotosTab;
