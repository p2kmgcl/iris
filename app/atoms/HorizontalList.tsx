import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import styles from './HorizontalList.css';

export interface ItemProps {
  itemId: string;
  itemHeight: number;
  itemWidth: number;
}

interface ListContext {
  itemWidth: number;
  itemHeight: number;
  listStyle: CSSProperties;
}

interface RenderListItem {
  key: string;
  className: string;
  style: CSSProperties;
  itemProps: ItemProps;
}

function clamp(value: number, min: number, max: number) {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
}

const HorizontalList: FC<{
  itemIdList: string[];
  initialItemId: string;
  Item: FC<ItemProps>;
}> = ({ itemIdList, initialItemId, Item }) => {
  const [index, setIndex] = useState(() => itemIdList.indexOf(initialItemId));
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);

  const [
    { itemWidth, itemHeight, listStyle },
    setListContext,
  ] = useState<ListContext>(() => ({
    itemWidth: 0,
    itemHeight: 0,
    listStyle: {},
  }));

  const listItems = useMemo<RenderListItem[]>(() => {
    if (!itemWidth) {
      return [];
    }

    const overScan = itemWidth;
    const from = Math.max(index * itemWidth - overScan, 0);
    const to = from + itemWidth + overScan;

    const fromIndex = Math.floor(from / itemWidth);
    const toIndex = Math.min(Math.ceil(to / itemWidth), itemIdList.length);

    const nextListItems = [];

    for (let i = fromIndex; i <= toIndex; i++) {
      if (!itemIdList[i]) {
        continue;
      }

      nextListItems.push({
        key: `${itemIdList.length}-${i}`,
        className: styles.cell,
        style: {
          top: 0,
          left: i * itemWidth,
          height: itemHeight,
          width: itemWidth,
        },
        itemProps: {
          itemId: itemIdList[i],
          itemWidth: itemWidth,
          itemHeight: itemHeight,
        },
      });
    }

    return nextListItems;
  }, [index, itemWidth, itemHeight, itemIdList]);

  useEffect(() => {
    if (!wrapper || !itemIdList.length) {
      return;
    }

    const handleResize = () => {
      const {
        height: wrapperHeight,
        width: wrapperWidth,
      } = wrapper.getBoundingClientRect();

      setListContext({
        itemWidth: wrapperWidth,
        itemHeight: wrapperHeight,
        listStyle: { width: wrapperWidth * itemIdList.length },
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wrapper, itemIdList]);

  useEffect(() => {
    if (!wrapper) {
      return;
    }

    const scrollLeft = index * itemWidth;
    let isNaturalScroll = false;

    const handleScroll = () => {
      if (!isNaturalScroll) {
        isNaturalScroll = true;
        return;
      }

      const delta = (wrapper.scrollLeft - scrollLeft) / itemWidth;

      let nextIndex = index;

      if (delta >= 1) {
        nextIndex = clamp(index + 1, 0, itemIdList.length - 1);
      } else if (delta <= -1) {
        nextIndex = clamp(index - 1, 0, itemIdList.length - 1);
      }

      if (nextIndex !== index) {
        isNaturalScroll = false;
        setIndex(nextIndex);
      }
    };

    wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, [wrapper, itemWidth, index, itemIdList.length]);

  requestAnimationFrame(() => {
    wrapper?.scrollTo({ left: index * itemWidth, behavior: 'auto' });
  });

  return (
    <div ref={setWrapper} className={styles.wrapper}>
      {itemIdList.length && itemWidth ? (
        <div className={styles.list} style={listStyle}>
          {listItems.map((cell) => (
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

export default HorizontalList;
