import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import styles from './HorizontalList.css';

export interface ItemProps {
  index: number;
  isVisible: boolean;
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
  initialIndex: number;
  itemCount: number;
  Item: FC<ItemProps>;
}> = ({ initialIndex, itemCount, Item }) => {
  const [index, setIndex] = useState(initialIndex);
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
    const toIndex = Math.min(Math.ceil(to / itemWidth), itemCount);

    const nextListItems = [];

    for (let i = fromIndex; i <= toIndex; i++) {
      nextListItems.push({
        key: `${itemCount}-${i}`,
        className: styles.cell,
        style: {
          top: 0,
          left: i * itemWidth,
          height: itemHeight,
          width: itemWidth,
        },
        itemProps: {
          index: i,
          isVisible: i === index,
          itemWidth: itemWidth,
          itemHeight: itemHeight,
        },
      });
    }

    return nextListItems;
  }, [index, itemWidth, itemHeight, itemCount]);

  useEffect(() => {
    if (!wrapper || !itemCount) {
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
        listStyle: { width: wrapperWidth * itemCount },
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wrapper, itemCount]);

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
        nextIndex = clamp(index + 1, 0, itemCount - 1);
      } else if (delta <= -1) {
        nextIndex = clamp(index - 1, 0, itemCount - 1);
      }

      if (nextIndex !== index) {
        isNaturalScroll = false;
        setIndex(nextIndex);
      }
    };

    wrapper.addEventListener('scroll', handleScroll);

    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, [wrapper, itemWidth, index, itemCount]);

  requestAnimationFrame(() => {
    wrapper?.scrollTo({ left: index * itemWidth, behavior: 'auto' });
  });

  return (
    <div ref={setWrapper} className={styles.wrapper}>
      {itemCount && itemWidth ? (
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
