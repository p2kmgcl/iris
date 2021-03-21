import { CSSProperties, FC, useEffect, useState } from 'react';
import styles from './Grid.module.css';
import { useScrollBarWidth } from '../hooks/useScrollBarWidth';

export interface ItemProps {
  itemId: string;
  itemWidth: number;
  itemHeight: number;
}

type GridProps<T> = {
  itemIdList: string[];
  itemProps: T;
  minColumnCount: number;
  itemMaxSize: number;
  itemSizeRatio: number;
  Item: FC<T & ItemProps>;
};

export function Grid<T>({
  itemIdList,
  itemProps,
  minColumnCount,
  itemMaxSize,
  itemSizeRatio,
  Item,
}: GridProps<T>): JSX.Element {
  const scrollBarWidth = useScrollBarWidth();
  const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const [gridContext, setGridContext] = useState<{
    itemWidth: number;
    itemHeight: number;
    columnCount: number;
    rowCount: number;
    gridStyle: CSSProperties;
  }>(() => ({
    itemWidth: 0,
    itemHeight: 0,
    columnCount: 0,
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
    if (!wrapperElement || !itemIdList.length) {
      return;
    }

    const handleResize = () => {
      const wrapperWidth =
        wrapperElement.getBoundingClientRect().width - scrollBarWidth;

      const nextColumnCount = Math.floor(
        wrapperWidth /
          Math.min(
            itemMaxSize,
            // Try having at least three columns
            Math.min(wrapperWidth, window.innerHeight) / minColumnCount,
          ),
      );

      const nextRowCount = Math.ceil(itemIdList.length / nextColumnCount);
      const nextItemSize = Math.floor(wrapperWidth / nextColumnCount);

      setGridContext({
        itemWidth: nextItemSize,
        itemHeight: nextItemSize * itemSizeRatio,
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
  }, [
    wrapperElement,
    itemIdList,
    itemSizeRatio,
    itemMaxSize,
    minColumnCount,
    scrollBarWidth,
  ]);

  useEffect(() => {
    if (!wrapperElement || !gridContext.itemWidth || !gridContext.itemHeight) {
      return;
    }

    const container = wrapperElement.parentElement || window;

    let lastFromRowIndex = 0;
    let lastToRowIndex = 0;

    const handleScroll = () => {
      const viewHeight = window.innerHeight;
      const top = wrapperElement.getBoundingClientRect().top;

      const from = Math.max(-top - viewHeight, 0);
      const to = from + viewHeight * 2;

      const fromRowIndex = Math.floor(from / gridContext.itemHeight);
      const toRowIndex = Math.ceil(to / gridContext.itemHeight);

      // Do not trigger render unless visible area has changed
      if (fromRowIndex === lastFromRowIndex && toRowIndex === lastToRowIndex) {
        return;
      }

      lastFromRowIndex = fromRowIndex;
      lastToRowIndex = toRowIndex;

      const nextRenderGrid = [];

      for (let i = fromRowIndex; i <= toRowIndex; i++) {
        for (let j = 0; j < gridContext.columnCount; j++) {
          const index = i * gridContext.columnCount + j;

          if (index >= itemIdList.length) {
            break;
          }

          nextRenderGrid.push({
            // TODO Use itemId to preserve keys on resize
            key: `${gridContext.columnCount}-${gridContext.rowCount}-${i}-${j}`,
            className: styles.cell,
            style: {
              top: i * gridContext.itemHeight,
              left: j * gridContext.itemWidth,
              width: gridContext.itemWidth,
              height: gridContext.itemHeight,
            },
            itemProps: {
              itemId: itemIdList[index],
              itemWidth: gridContext.itemWidth,
              itemHeight: gridContext.itemHeight,
            },
          });
        }
      }

      setRenderGrid(nextRenderGrid);
    };

    handleScroll();

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [wrapperElement, gridContext, itemIdList]);

  return (
    <div ref={setWrapperElement} className={styles.wrapper}>
      {itemIdList.length && gridContext.columnCount ? (
        <div className={styles.grid} style={gridContext.gridStyle}>
          {renderGrid.map((cell) => (
            <div key={cell.key} className={cell.className} style={cell.style}>
              <div className={styles.cellContent}>
                <Item {...itemProps} {...cell.itemProps} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
