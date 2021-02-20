import React, { FC, useCallback } from 'react';
import Grid, { ItemProps } from '../../atoms/Grid';
import useAsyncMemo from '../../hooks/useAsyncMemo';
import Database from '../../utils/Database';
import PhotoLoader from '../../utils/PhotoLoader';
import PhotoThumbnail from '../../atoms/PhotoThumbnail';

const AllPhotosTab: FC = () => {
  const photoCount = useAsyncMemo<number>(
    () => Database.selectPhotoCount(),
    [],
    0,
  );

  const Photo = useCallback(function PhotoCallback({ index }: ItemProps) {
    const photo = useAsyncMemo(
      () => PhotoLoader.getLoadedPhotoFromIndex(index),
      [index],
      null,
    );

    return photo ? <PhotoThumbnail index={index} photo={photo} /> : null;
  }, []);

  return <Grid itemCount={photoCount} Item={Photo} />;
};

export default AllPhotosTab;
