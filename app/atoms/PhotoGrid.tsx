import React, { FC, useEffect, useState } from 'react';
import { FixedSizeGrid, areEqual, GridChildComponentProps } from 'react-window';
import { Photo } from '../../types/Schema';
import { PhotoThumbnail } from './PhotoThumbnail';
import { useAsyncMemo } from '../hooks/useAsyncMemo';
import { Database } from '../utils/Database';
import { useIsScanning } from '../contexts/ScanContext';
import styles from './PhotoGrid.css';

const BASE_THUMBNAIL_SIZE = 128;

export const PhotoGrid: FC<{ albumItemId?: string }> = ({
  albumItemId = null,
}) => {
  const isScanning = useIsScanning();
  const [countTrigger, setCountTrigger] = useState(false);
  const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const [
    {
      thumbnailSize,
      columnCount,
      width,
      height,
      rowCount,
      overscanColumnCount,
    },
    setSize,
  ] = useState({
    thumbnailSize: BASE_THUMBNAIL_SIZE,
    columnCount: 1,
    width: 0,
    height: 0,
    rowCount: 0,
    overscanColumnCount: 0,
  });

  const photoCount = useAsyncMemo<number>(
    () => Database.selectPhotoCount(albumItemId),
    [countTrigger, albumItemId],
    0,
  );

  useEffect(() => {
    if (!wrapperElement || !photoCount) {
      return;
    }

    const handleResize = () => {
      const { width } = wrapperElement.getBoundingClientRect();
      const nextColumnCount = Math.floor(width / BASE_THUMBNAIL_SIZE);
      const nextThumbnailSize = Math.ceil(width / nextColumnCount);
      const height =
        Math.ceil(photoCount / nextColumnCount) * nextThumbnailSize;

      setSize({
        columnCount: nextColumnCount,
        thumbnailSize: nextThumbnailSize,
        rowCount: Math.ceil(photoCount / nextColumnCount),
        overscanColumnCount: Math.ceil(height / thumbnailSize),
        height,
        width,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wrapperElement, photoCount]);

  useEffect(() => {
    if (isScanning) {
      const intervalId = setInterval(() => {
        setCountTrigger((prevCountTrigger) => !prevCountTrigger);
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isScanning, photoCount]);

  if (!photoCount) {
    return null;
  }

  return (
    <div ref={setWrapperElement} className={styles.wrapper}>
      <FixedSizeGrid
        className={styles.grid}
        columnCount={columnCount}
        rowCount={rowCount}
        columnWidth={thumbnailSize}
        rowHeight={thumbnailSize}
        overscanRowCount={overscanColumnCount}
        height={height}
        width={width}
        itemData={{ albumItemId, photoCount, columnCount, thumbnailSize }}
        children={Thumbnail}
      />
    </div>
  );
};

const Thumbnail: FC<GridChildComponentProps> = React.memo(
  ({ data, rowIndex, columnIndex, style }) => {
    const {
      albumItemId = null,
      photoCount,
      columnCount,
      thumbnailSize,
    } = data as {
      albumItemId?: string;
      photoCount: number;
      columnCount: number;
      thumbnailSize: number;
    };

    const photo = useAsyncMemo<Photo | null>(
      () =>
        Database.selectPhotoFromIndex(
          rowIndex * columnCount + columnIndex,
          albumItemId,
        ),
      [albumItemId, photoCount, rowIndex, columnCount, columnIndex],
      null,
    );

    if (!photo) {
      return null;
    }

    return (
      <button
        className={styles.thumbnailButton}
        type="button"
        style={{
          ...style,
          width: thumbnailSize,
          height: thumbnailSize,
        }}
      >
        <PhotoThumbnail photo={photo} size={thumbnailSize} />
      </button>
    );
  },
  areEqual,
);
