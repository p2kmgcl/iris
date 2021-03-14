import {
  CSSProperties,
  FC,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import styles from './Slides.css';

export interface SlideProps {
  itemId: string;
  slideHeight: number;
  slideWidth: number;
}

interface SlideItem {
  itemId: string;
  slideWrapperProps: {
    key: string;
    className: string;
    style: CSSProperties;
  };
  slideProps: SlideProps;
}

const Slides: FC<{
  slideIdList: string[];
  initialSlideId: string;
  Slide: FC<SlideProps>;
}> = ({ slideIdList, initialSlideId, Slide }) => {
  const initialIndex = useMemo(() => {
    return slideIdList.indexOf(initialSlideId);
  }, [slideIdList, initialSlideId]);

  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
  const [list, setList] = useState<HTMLDivElement | null>(null);
  const [slideSize, setSlideSize] = useState({ width: 0, height: 0 });

  const [slides, setSlides] = useReducer(
    (prevSlides: SlideItem[], nextSlides: SlideItem[]) =>
      nextSlides.length === prevSlides.length &&
      nextSlides.every((nextSlide) =>
        prevSlides.find(
          (prevSlide) =>
            nextSlide.itemId === prevSlide.itemId &&
            nextSlide.slideProps.slideWidth === prevSlide.slideProps.slideWidth,
        ),
      )
        ? prevSlides
        : nextSlides,
    [],
  );

  useEffect(() => {
    if (!wrapper || !list) {
      return;
    }

    const updateSlideSize = () => {
      const slideSize = wrapper.getBoundingClientRect();
      list.style.height = `${slideSize.height}px`;
      list.style.width = `${slideIdList.length * slideSize.width}px`;

      wrapper.scrollTo({
        left:
          Math.round(wrapper.scrollLeft / slideSize.width) * slideSize.width,
      });

      setSlideSize(slideSize);
    };

    updateSlideSize();

    if (initialIndex) {
      const initialSlideSize = wrapper.getBoundingClientRect();
      wrapper.scrollTo({ left: initialIndex * initialSlideSize.width });
    }

    window.addEventListener('resize', updateSlideSize);
    return () => window.removeEventListener('resize', updateSlideSize);
  }, [wrapper, list, initialIndex, slideIdList]);

  useEffect(() => {
    if (!wrapper || !slideSize.width) {
      return;
    }

    const updateSlides = () => {
      const overScan = slideSize.width;
      const from = Math.max(wrapper.scrollLeft - overScan, 0);
      const to = from + slideSize.width + overScan;

      const fromIndex = Math.floor(from / slideSize.width);

      const toIndex = Math.min(
        Math.ceil(to / slideSize.width),
        slideIdList.length,
      );

      const nextSlides = [];

      for (let i = fromIndex; i <= toIndex; i++) {
        if (!slideIdList[i]) {
          continue;
        }

        nextSlides.push({
          itemId: slideIdList[i],
          slideWrapperProps: {
            key: slideIdList[i],
            className: styles.slide,
            style: {
              top: 0,
              left: i * slideSize.width,
              height: slideSize.height,
              width: slideSize.width,
            },
          },
          slideProps: {
            itemId: slideIdList[i],
            slideWidth: slideSize.width,
            slideHeight: slideSize.height,
          },
        });
      }

      setSlides(nextSlides);
    };

    updateSlides();
    wrapper.addEventListener('scroll', updateSlides);
    return () => wrapper.removeEventListener('scroll', updateSlides);
  }, [wrapper, slideSize, slideIdList]);

  useEffect(() => {
    if (!wrapper || !slideSize.width) {
      return;
    }

    let initialClientX: number | undefined;

    const handleSlideStart = (event: TouchEvent) => {
      event.preventDefault();

      if (event.touches.length === 1) {
        initialClientX = event.touches.item(0)?.clientX || 0;
      }
    };

    const handleSlideMove = (event: TouchEvent) => {
      event.preventDefault();

      let clientX;

      if (event.touches.length === 1) {
        clientX = event.touches.item(0)?.clientX || 0;
      }

      if (
        initialClientX !== undefined &&
        clientX !== undefined &&
        clientX !== initialClientX
      ) {
        const targetScroll =
          wrapper.scrollLeft +
          (clientX > initialClientX ? -slideSize.width : slideSize.width);

        wrapper.scrollTo({
          left: targetScroll,
          behavior: 'smooth',
        });

        initialClientX = undefined;
      }
    };

    const handleSlideEnd = () => {
      initialClientX = undefined;
    };

    wrapper.addEventListener('touchstart', handleSlideStart);
    wrapper.addEventListener('touchmove', handleSlideMove);
    wrapper.addEventListener('touchend', handleSlideEnd);
    wrapper.addEventListener('touchcancel', handleSlideEnd);

    return () => {
      wrapper.removeEventListener('touchstart', handleSlideStart);
      wrapper.removeEventListener('touchmove', handleSlideMove);
      wrapper.removeEventListener('touchend', handleSlideEnd);
      wrapper.removeEventListener('touchcancel', handleSlideEnd);
    };
  }, [wrapper, slideSize]);

  return (
    <div ref={setWrapper} className={styles.wrapper}>
      <div ref={setList} className={styles.list}>
        {slides.map((slide) => (
          <div {...slide.slideWrapperProps}>
            <Slide {...slide.slideProps} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slides;
