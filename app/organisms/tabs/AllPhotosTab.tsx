import React, { FC } from 'react';
import { useAsyncMemo } from '../../hooks/useAsyncMemo';
import { Database } from '../../utils/Database';
import { PhotoGrid } from '../../atoms/PhotoGrid';

export const AllPhotosTab: FC = () => {
  const photos = useAsyncMemo(() => Database.selectPhotos(), []);
  return <PhotoGrid photos={photos || []} />;
};
