import React, { FC, useCallback } from 'react';
import Grid, { ItemProps } from '../../atoms/Grid';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import PhotoLoader from '../../utils/PhotoLoader';
import { useScanStatus } from '../../contexts/ScanContext';
import PhotoThumbnail from '../../atoms/PhotoThumbnail';

const AllPhotosTab: FC = () => {
  const scanTrigger = useScanStatus();

  const photoCount = useAsyncMemo<number>(
    () => Database.selectPhotoCount(),
    [scanTrigger],
    0,
  );

  const Photo = useCallback(function PhotoCallback({ index }: ItemProps) {
    const photo = useAsyncMemo(
      () => PhotoLoader.getLoadedPhotoFromIndex(index),
      [index],
      null,
    );

    return photo ? <PhotoThumbnail photo={photo} album={null} /> : null;
  }, []);

  return <Grid itemCount={photoCount} Item={Photo} />;
};

export default AllPhotosTab;
