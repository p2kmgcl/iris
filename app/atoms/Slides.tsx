import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import styles from './Slides.css';

export interface SlideProps {
  itemId: string;
  slideHeight: number;
  slideWidth: number;
}

interface ListContext {
  slideWidth: number;
  slideHeight: number;
  slideStyle: CSSProperties;
}

interface RenderSlideItem {
  key: string;
  className: string;
  style: CSSProperties;
  slideProps: SlideProps;
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

const Slides: FC<{
  slideIdList: string[];
  initialSlideId: string;
  Slide: FC<SlideProps>;
}> = ({ slideIdList, initialSlideId, Slide }) => {
  const [index, setIndex] = useState(() => slideIdList.indexOf(initialSlideId));
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);

  const [
    { slideWidth, slideHeight, slideStyle },
    setListContext,
  ] = useState<ListContext>(() => ({
    slideWidth: 0,
    slideHeight: 0,
    slideStyle: {},
  }));

  const slideItems = useMemo<RenderSlideItem[]>(() => {
    if (!slideWidth) {
      return [];
    }

    const overScan = slideWidth;
    const from = Math.max(index * slideWidth - overScan, 0);
    const to = from + slideWidth + overScan;

    const fromIndex = Math.floor(from / slideWidth);
    const toIndex = Math.min(Math.ceil(to / slideWidth), slideIdList.length);

    const nextListItems = [];

    for (let i = fromIndex; i <= toIndex; i++) {
      if (!slideIdList[i]) {
        continue;
      }

      nextListItems.push({
        key: slideIdList[i],
        className: styles.cell,
        style: {
          top: 0,
          left: i * slideWidth,
          height: slideHeight,
          width: slideWidth,
        },
        slideProps: {
          itemId: slideIdList[i],
          slideWidth: slideWidth,
          slideHeight: slideHeight,
        },
      });
    }

    return nextListItems;
  }, [index, slideWidth, slideHeight, slideIdList]);

  useEffect(() => {
    if (!wrapper || !slideIdList.length) {
      return;
    }

    const handleResize = () => {
      const {
        height: wrapperHeight,
        width: wrapperWidth,
      } = wrapper.getBoundingClientRect();

      setListContext({
        slideWidth: wrapperWidth,
        slideHeight: wrapperHeight,
        slideStyle: { width: wrapperWidth * slideIdList.length },
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [wrapper, slideIdList]);

  useEffect(() => {
    if (!wrapper) {
      return;
    }

    const scrollLeft = index * slideWidth;
    let isNaturalScroll = false;

    const handleScroll = () => {
      if (!isNaturalScroll) {
        isNaturalScroll = true;
        return;
      }

      const delta = (wrapper.scrollLeft - scrollLeft) / slideWidth;

      let nextIndex = index;

      if (delta >= 1) {
        nextIndex = clamp(index + 1, 0, slideIdList.length - 1);
      } else if (delta <= -1) {
        nextIndex = clamp(index - 1, 0, slideIdList.length - 1);
      }

      if (nextIndex !== index) {
        isNaturalScroll = false;
        setIndex(nextIndex);
      }
    };

    wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, [wrapper, slideWidth, index, slideIdList.length]);

  requestAnimationFrame(() => {
    wrapper?.scrollTo({ left: index * slideWidth, behavior: 'auto' });
  });

  return (
    <div ref={setWrapper} className={styles.wrapper}>
      {slideIdList.length && slideWidth ? (
        <div className={styles.list} style={slideStyle}>
          {slideItems.map((slide) => (
            <div
              key={slide.key}
              className={slide.className}
              style={slide.style}
            >
              <div className={styles.cellContent}>
                <Slide {...slide.slideProps} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Slides;
