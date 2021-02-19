import React, { CSSProperties, FC, useEffect, useState } from 'react';
import styles from './HorizontalList.css';

export interface ItemProps {
  index: number;
  itemHeight: number;
  itemWidth: number;
}

const HorizontalList: FC<{
  initialIndex?: number;
  itemCount: number;
  Item: FC<ItemProps>;
}> = ({ initialIndex = 0, itemCount, Item }) => {
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
  const [list, setList] = useState<HTMLDivElement | null>(null);

  const [listContext, setListContext] = useState<{
    itemWidth: number;
    itemHeight: number;
    listStyle: CSSProperties;
  }>(() => ({
    itemWidth: 0,
    itemHeight: 0,
    listStyle: {},
  }));

  const [renderList, setRenderList] = useState<
    Array<{
      key: string;
      className: string;
      style: CSSProperties;
      itemProps: ItemProps;
    }>
  >(() => []);

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

      requestAnimationFrame(() => {
        wrapper.scrollTo({ left: wrapperWidth * initialIndex });
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wrapper, itemCount, initialIndex]);

  useEffect(() => {
    if (!wrapper || !list) {
      return;
    }

    const handleScroll = () => {
      const left = wrapper.scrollLeft;
      const overScan = listContext.itemWidth * 2;
      const from = Math.max(left - overScan, 0);
      const to = from + listContext.itemWidth + overScan;

      const fromIndex = Math.floor(from / listContext.itemWidth);
      const toIndex = Math.min(
        Math.ceil(to / listContext.itemWidth),
        itemCount,
      );

      const nextRenderList = [];

      for (let i = fromIndex; i <= toIndex; i++) {
        nextRenderList.push({
          key: `${itemCount}-${i}`,
          className: styles.cell,
          style: {
            top: 0,
            left: i * listContext.itemWidth,
            height: listContext.itemHeight,
            width: listContext.itemWidth,
          },
          itemProps: {
            index: i,
            itemWidth: listContext.itemWidth,
            itemHeight: listContext.itemHeight,
          },
        });
      }

      setRenderList(nextRenderList);
    };

    handleScroll();
    wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, [wrapper, list, listContext, itemCount]);

  useEffect(() => {
    if (!wrapper || !listContext.itemWidth) {
      return;
    }

    const { itemWidth } = listContext;
    let scrollLeft = 0;
    let touchStartX: number | null = null;
    let delta: number | null = null;

    requestAnimationFrame(() => {
      scrollLeft = wrapper.scrollLeft;
    });

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        touchStartX = event.touches[0].clientX;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartX !== null && event.touches.length === 1) {
        delta = touchStartX - event.touches[0].clientX;
        wrapper.scrollLeft = scrollLeft + delta;
      }
    };

    const handleTouchEnd = () => {
      if (delta !== null) {
        if (delta < -itemWidth * 0.25) {
          scrollLeft -= itemWidth;
        } else if (delta > itemWidth * 0.25) {
          scrollLeft += itemWidth;
        }

        wrapper.scrollTo({ left: scrollLeft, behavior: 'smooth' });

        delta = null;
        touchStartX = null;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft') {
        scrollLeft -= itemWidth;
        wrapper.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      } else if (event.code === 'ArrowRight') {
        scrollLeft += itemWidth;
        wrapper.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    };

    wrapper.addEventListener('touchstart', handleTouchStart);
    wrapper.addEventListener('touchmove', handleTouchMove);
    wrapper.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [wrapper, listContext, initialIndex]);

  return (
    <div ref={setWrapper} className={styles.wrapper}>
      {itemCount && listContext.itemWidth ? (
        <div
          ref={setList}
          className={styles.list}
          style={listContext.listStyle}
        >
          {renderList.map((cell) => (
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
