import { FC, useEffect, useState } from 'react';
import styles from './Slides.css';

const SLIDE_OVERSCAN = 2;

export interface SlideProps {
  itemId: string;
  slideHeight: number;
  slideWidth: number;
}

const Slides: FC<{
  slideIdList: string[];
  initialSlideId: string;
  Slide: FC<SlideProps>;
}> = ({ slideIdList, initialSlideId, Slide }) => {
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  const [renderedSlides, setRenderedSlides] = useState<string[]>([]);

  useEffect(() => {
    if (!wrapper) return;

    const updateWrapperSize = () => {
      setWrapperSize(wrapper.getBoundingClientRect());
    };

    updateWrapperSize();
    window.addEventListener('resize', updateWrapperSize);
    return () => window.removeEventListener('resize', updateWrapperSize);
  }, [wrapper]);

  useEffect(() => {
    if (!wrapper || wrapperSize.width === 0) return;

    let index = slideIdList.indexOf(initialSlideId);
    let initialScrollLeft = wrapper.scrollLeft;

    const throttle = (fn: (...args: any[]) => void, delay: number) => {
      let lastExecutionTime = new Date('1991-10-01').getTime();

      return (...args: any[]) => {
        const now = Date.now();

        if (now - lastExecutionTime > delay) {
          lastExecutionTime = now;
          fn(...args);
        }
      };
    };

    const updateRenderedSlides = throttle((nextIndex: number) => {
      index = nextIndex;

      const from = Math.max(index - SLIDE_OVERSCAN, 0);
      const to = Math.min(index + SLIDE_OVERSCAN + 1, slideIdList.length);

      const nextRenderedSlides = slideIdList.slice(from, to);
      const slideId = slideIdList[index];
      const slideIndex = nextRenderedSlides.indexOf(slideId);

      setRenderedSlides(nextRenderedSlides);

      initialScrollLeft = slideIndex * wrapperSize.width;
      wrapper.scrollLeft = initialScrollLeft;

      console.log(index, slideIndex, wrapper.scrollLeft);
    }, 500);

    const handleScroll = () => {
      const scrollLeft = wrapper.scrollLeft - initialScrollLeft;

      if (scrollLeft >= wrapperSize.width) {
        updateRenderedSlides(Math.min(index + 1, slideIdList.length - 1));
      } else if (scrollLeft <= -wrapperSize.width) {
        updateRenderedSlides(Math.max(index - 1, 0));
      }
    };

    updateRenderedSlides(index);
    wrapper?.addEventListener('scroll', handleScroll);
    return () => wrapper?.removeEventListener('scroll', handleScroll);
  }, [initialSlideId, slideIdList, wrapper, wrapperSize]);

  return (
    <div ref={setWrapper} className={styles.wrapper}>
      {renderedSlides.map((slideId) => (
        <div key={slideId} className={styles.slide}>
          <Slide
            itemId={slideId}
            slideWidth={wrapperSize.width}
            slideHeight={wrapperSize.height}
          />
        </div>
      ))}
    </div>
  );
};

export default Slides;
