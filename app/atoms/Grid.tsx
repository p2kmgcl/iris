import React, { CSSProperties, FC, useEffect, useState } from 'react';
import styles from './Grid.css';

const MIN_ITEM_SIZE = 180;

export interface ItemProps {
  rowIndex: number;
  columnIndex: number;
  itemSize: number;
}

const Grid: FC<{ itemCount: number; Item: FC<ItemProps> }> = ({
  itemCount,
  Item,
}) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const [gridContext, setGridContext] = useState<{
    itemSize: number;
    columnCount: number;
    rowCount: number;
    gridStyle: CSSProperties;
  }>(() => ({
    itemSize: MIN_ITEM_SIZE,
    columnCount: 1,
    rowCount: 0,
    gridStyle: {},
  }));

  const [renderGrid, setRenderGrid] = useState<
    Array<{
      key: string;
      className: string;
      style: CSSProperties;
      itemProps: ItemProps;
    }>
  >(() => []);

  useEffect(() => {
    if (!wrapperElement || !itemCount) {
      return;
    }

    const handleResize = () => {
      const { width: wrapperWidth } = wrapperElement.getBoundingClientRect();

      const nextColumnCount = Math.floor(wrapperWidth / MIN_ITEM_SIZE);
      const nextRowCount = Math.ceil(itemCount / nextColumnCount);
      const nextItemSize = Math.floor(wrapperWidth / nextColumnCount);

      setGridContext({
        itemSize: nextItemSize,
        columnCount: nextColumnCount,
        rowCount: nextRowCount,
        gridStyle: {
          height: nextRowCount * nextItemSize,
          width: nextColumnCount * nextItemSize,
        },
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wrapperElement, itemCount]);

  useEffect(() => {
    if (!wrapperElement) {
      return;
    }

    const handleScroll = () => {
      const overScan = window.innerHeight;
      const top = wrapperElement.getBoundingClientRect().top;

      const from = Math.max(-top - overScan, 0);
      const to = from + window.innerHeight + overScan;

      const fromIndex = Math.floor(from / gridContext.itemSize);
      const toIndex = Math.ceil(to / gridContext.itemSize);

      const nextRenderGrid = [];

      for (let i = fromIndex; i <= toIndex; i++) {
        for (let j = 0; j < gridContext.columnCount; j++) {
          nextRenderGrid.push({
            key: `${itemCount}-${i}-${j}`,
            className: styles.cell,
            style: {
              top: i * gridContext.itemSize,
              left: j * gridContext.itemSize,
              width: gridContext.itemSize,
              height: gridContext.itemSize,
            },
            itemProps: {
              rowIndex: i,
              columnIndex: j,
              itemSize: gridContext.itemSize,
            },
          });
        }
      }

      setRenderGrid(nextRenderGrid);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [wrapperElement, gridContext, itemCount]);

  if (!itemCount) {
    return null;
  }

  return (
    <div ref={setWrapperElement} className={styles.wrapper}>
      <div className={styles.grid} style={gridContext.gridStyle}>
        {renderGrid.map((cell) => (
          <div key={cell.key} className={cell.className} style={cell.style}>
            <div className={styles.cellContent}>
              <Item {...cell.itemProps} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;
