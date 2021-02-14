import React, { FC, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid, areEqual, GridChildComponentProps } from 'react-window';
import { Photo } from '../../types/Schema';
import { Box, useTheme } from '@material-ui/core';
import { PhotoThumbnail } from './PhotoThumbnail';
import { useAsyncMemo } from '../hooks/useAsyncMemo';
import { Database } from '../utils/Database';
import { useIsScanning } from '../contexts/ScanContext';

const BASE_THUMBNAIL_SIZE = 128;
const LARGE_BASE_THUMBNAIL_SIZE = 256;
const LARGE_THRESHOLD = 1440;

export const PhotoGrid: FC = () => {
  const isScanning = useIsScanning();
  const [countTrigger, setCountTrigger] = useState(false);

  const photoCount = useAsyncMemo<number>(
    () => Database.selectPhotoCount(),
    [countTrigger],
    0,
  );

  useEffect(() => {
    if (isScanning) {
      const intervalId = setInterval(() => {
        setCountTrigger((prevCountTrigger) => !prevCountTrigger);
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isScanning]);

  const theme = useTheme();

  if (!photoCount) {
    return null;
  }

  return (
    <Box
      style={{
        flexGrow: 1,
        boxSizing: 'border-box',
        padding: 1,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AutoSizer>
        {({ height, width }) => {
          const numColumns = Math.floor(
            width /
              (width >= LARGE_THRESHOLD
                ? LARGE_BASE_THUMBNAIL_SIZE
                : BASE_THUMBNAIL_SIZE),
          );

          const thumbnailSize = Math.ceil(width / numColumns);

          return (
            <FixedSizeGrid
              style={{ overflowX: 'hidden', outline: 'none' }}
              columnCount={numColumns}
              rowCount={Math.ceil(photoCount / numColumns)}
              columnWidth={thumbnailSize}
              rowHeight={thumbnailSize}
              overscanRowCount={Math.ceil(height / thumbnailSize)}
              height={height}
              width={width}
              itemData={{ photoCount, numColumns, thumbnailSize }}
              children={Thumbnail}
            />
          );
        }}
      </AutoSizer>
    </Box>
  );
};

const Thumbnail: FC<GridChildComponentProps> = React.memo(
  ({ data, rowIndex, columnIndex, style }) => {
    const { photoCount, numColumns, thumbnailSize } = data as {
      photoCount: number;
      numColumns: number;
      thumbnailSize: number;
    };

    const photo = useAsyncMemo<Photo | null>(
      () => Database.selectPhotoFromIndex(rowIndex * numColumns + columnIndex),
      [photoCount, rowIndex, numColumns, columnIndex],
      null,
    );

    if (!photo) {
      return null;
    }

    return (
      <Box
        style={{
          ...style,
          boxSizing: 'border-box',
          padding: 2,
          width: thumbnailSize,
          height: thumbnailSize,
        }}
      >
        <button
          style={{
            display: 'block',
            padding: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'none',
          }}
        >
          <PhotoThumbnail photo={photo} size={thumbnailSize - 4} />
        </button>
      </Box>
    );
  },
  areEqual,
);
