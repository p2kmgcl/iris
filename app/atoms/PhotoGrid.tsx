import React, { FC, useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid, areEqual, GridChildComponentProps } from 'react-window';
import { Photo } from '../../types/Schema';
import { Box, useTheme } from '@material-ui/core';
import { PhotoThumbnail } from './PhotoThumbnail';

const BASE_THUMBNAIL_SIZE = 128;
const LARGE_BASE_THUMBNAIL_SIZE = 256;
const LARGE_THRESHOLD = 1440;

export const PhotoGrid: FC<{ photos: Photo[] }> = ({ photos }) => {
  const theme = useTheme();

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
              rowCount={Math.ceil(photos.length / numColumns)}
              columnWidth={thumbnailSize}
              rowHeight={thumbnailSize}
              overscanRowCount={Math.ceil(height / thumbnailSize)}
              height={height}
              width={width}
              itemData={{
                photos,
                numColumns,
                thumbnailSize,
              }}
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
    const { photos, numColumns, thumbnailSize } = data as {
      photos: Photo[];
      numColumns: number;
      thumbnailSize: number;
    };

    const photo = useMemo(
      () => photos[rowIndex * numColumns + columnIndex] as Photo | undefined,
      [photos, rowIndex, numColumns, columnIndex],
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
