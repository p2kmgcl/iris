import { CSSProperties, FC, useEffect, useState } from 'react';
import styles from './Grid.css';

const MAX_ITEM_SIZE = 256;

export interface ItemProps {
  index: number;
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
    itemSize: 0,
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
    if (!wrapperElement || !itemCount) {
      return;
    }

    const handleResize = () => {
      const { width: wrapperWidth } = wrapperElement.getBoundingClientRect();

      const nextColumnCount = Math.floor(
        wrapperWidth /
          Math.min(
            MAX_ITEM_SIZE,
            // Try having at least three columns
            Math.min(window.innerWidth, window.innerHeight) / 3.25,
          ),
      );

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
    if (!wrapperElement || !gridContext.itemSize) {
      return;
    }

    const container = wrapperElement.parentElement || window;

    let lastFromRowIndex = 0;
    let lastToRowIndex = 0;

    const handleScroll = () => {
      const overScan = window.innerHeight;
      const top = wrapperElement.getBoundingClientRect().top;

      const from = Math.max(-top - overScan, 0);
      const to = from + window.innerHeight + overScan;

      const fromRowIndex = Math.floor(from / gridContext.itemSize);
      const toRowIndex = Math.ceil(to / gridContext.itemSize);

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

          if (index >= itemCount) {
            break;
          }

          nextRenderGrid.push({
            // TODO Use itemId to preserve keys on resize
            key: `${gridContext.columnCount}-${gridContext.rowCount}-${i}-${j}`,
            className: styles.cell,
            style: {
              top: i * gridContext.itemSize,
              left: j * gridContext.itemSize,
              width: gridContext.itemSize,
              height: gridContext.itemSize,
            },
            itemProps: {
              index,
              itemSize: gridContext.itemSize,
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
  }, [wrapperElement, gridContext, itemCount]);

  return (
    <div ref={setWrapperElement} className={styles.wrapper}>
      {itemCount && gridContext.columnCount ? (
        <div className={styles.grid} style={gridContext.gridStyle}>
          {renderGrid.map((cell) => (
            <div key={cell.key} className={cell.className} style={cell.style}>
              <div className={styles.cellContent}>
                <Item {...cell.itemProps} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Grid;
