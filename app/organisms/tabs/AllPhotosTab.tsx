import React, { FC, useEffect, useState } from 'react';
import { useAsyncMemo } from '../../hooks/useAsyncMemo';
import { Database } from '../../utils/Database';
import { PhotoGrid } from '../../atoms/PhotoGrid';
import { useIsScanning } from '../../contexts/ScanContext';

export const AllPhotosTab: FC = () => {
  const isScanning = useIsScanning();
  const [scanTrigger, setScanTrigger] = useState(false);
  const photos = useAsyncMemo(() => Database.selectPhotos(), [scanTrigger]);

  useEffect(() => {
    if (!isScanning) {
      return;
    }

    const intervalId = setInterval(() => {
      setScanTrigger((prevScanTrigger) => !prevScanTrigger);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isScanning]);

  return <PhotoGrid photos={photos || []} />;
};
