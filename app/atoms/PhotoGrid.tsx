import React, { FC, useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid, areEqual, GridChildComponentProps } from 'react-window';
import { Photo } from '../../types/Schema';
import { Box, useTheme } from '@material-ui/core';

const BASE_THUMBNAIL_SIZE = 128;
const LARGE_BASE_THUMBNAIL_SIZE = 256;
const LARGE_THRESHOLD = 1440;

export const PhotoGrid: FC<{ photos: Photo[] }> = ({ photos }) => {
  const thumbnailURLGridRef = useRef<string[][]>([]);
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

          if (numColumns !== thumbnailURLGridRef.current.length) {
            thumbnailURLGridRef.current.forEach((column) => {
              column.forEach((url) => {
                URL.revokeObjectURL(url);
              });
            });
          }

          thumbnailURLGridRef.current = Array.from({
            length: numColumns,
          }).map(() => []);

          return (
            <FixedSizeGrid
              style={{ overflowX: 'hidden', outline: 'none' }}
              columnCount={numColumns}
              rowCount={Math.ceil(photos.length / numColumns)}
              columnWidth={thumbnailSize}
              rowHeight={thumbnailSize}
              overscanCount={Math.ceil(height / thumbnailSize)}
              height={height}
              width={width}
              itemData={{
                photos,
                numColumns,
                thumbnailSize,
                thumbnailURLGrid: thumbnailURLGridRef.current,
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
    const theme = useTheme();

    const { photos, numColumns, thumbnailSize, thumbnailURLGrid } = data as {
      photos: Photo[];
      numColumns: number;
      thumbnailSize: number;
      thumbnailURLGrid: string[][];
    };

    const [url, setURL] = useState(thumbnailURLGrid[columnIndex][rowIndex]);

    useEffect(() => {
      let thumbnailURL = thumbnailURLGrid[columnIndex][rowIndex];
      if (thumbnailURL) {
        setURL(thumbnailURL);
        return;
      }

      // Photo might not exist because
      // last row might be uneven

      const photo = photos[rowIndex * numColumns + columnIndex] as
        | Photo
        | undefined;

      if (!photo) return;

      thumbnailURL = URL.createObjectURL(photo.thumbnail);
      thumbnailURLGrid[columnIndex][rowIndex] = thumbnailURL;
      setURL(thumbnailURL);
    }, [photos, numColumns, thumbnailURLGrid, rowIndex, columnIndex]);

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
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundImage: url ? `url(${url})` : 'none',
            backgroundColor: theme.palette.background.paper,
          }}
        />
      </Box>
    );
  },
  areEqual,
);
