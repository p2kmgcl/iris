import { FC, useEffect, useMemo, useState } from 'react';
import styles from './Carousel.css';

export interface SlideProps {
  slideId: string;
}

interface CarouselProps {
  slideIdsList: string[];
  initialSlideId?: string;
  Slide: FC<SlideProps>;
}

export const Carousel: FC<CarouselProps> = ({
  initialSlideId,
  slideIdsList,
  Slide,
}) => {
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);

  const [index, setIndex] = useState<number>(() => {
    const initialIndex = slideIdsList.indexOf(initialSlideId || '');
    return initialIndex === -1 ? 0 : initialIndex;
  });

  const [previousId, currentId, nextId] = useMemo<
    [string | undefined, string, string | undefined]
  >(
    () => [
      slideIdsList[index - 1],
      slideIdsList[index],
      slideIdsList[index + 1],
    ],
    [index, slideIdsList],
  );

  useEffect(() => {
    if (!wrapper) {
      return;
    }

    let deltaClientX: number | undefined;
    let initialClientX: number | undefined;
    let wrapperWidth: number;

    const handleDragStart = (event: TouchEvent | MouseEvent) => {
      if (event instanceof TouchEvent && event.touches.length !== 1) return;

      initialClientX =
        event instanceof TouchEvent
          ? event.touches.item(0)?.clientX
          : event.clientX;

      wrapperWidth = wrapper.getBoundingClientRect().width;
    };

    const handleDragMove = (event: TouchEvent | MouseEvent) => {
      const clientX =
        event instanceof TouchEvent
          ? event.touches.item(0)?.clientX
          : event.clientX;

      if (initialClientX === undefined || clientX === undefined) return;

      event.preventDefault();

      deltaClientX = Math.min(
        Math.max((clientX - initialClientX) / wrapperWidth, -1),
        1,
      );

      if (deltaClientX < 0 && nextId) {
        wrapper.style.transform = `translateX(${deltaClientX * 100}%)`;
      } else if (deltaClientX > 0 && previousId) {
        wrapper.style.transform = `translateX(${deltaClientX * 100}%)`;
      } else {
        deltaClientX = undefined;
        wrapper.style.transform = '';
      }
    };

    const handleDragEnd = () => {
      if (deltaClientX !== undefined) {
        const deltaIndex = deltaClientX < 0 ? 1 : deltaClientX > 0 ? -1 : 0;

        if (deltaIndex !== 0) {
          const animationPromise: Promise<any> =
            Math.abs(deltaClientX) === 1
              ? Promise.resolve()
              : wrapper.animate(
                  [{ transform: `translateX(${deltaIndex * -100}%)` }],
                  {
                    duration: (1 - Math.abs(deltaClientX)) * 500,
                    easing: 'ease-out',
                  },
                ).finished;

          animationPromise.then(() => {
            wrapper.style.transform = '';
            setIndex((previousIndex) => previousIndex + deltaIndex);
          });
        }

        deltaClientX = undefined;
        initialClientX = undefined;
      } else {
        initialClientX = undefined;
      }
    };

    wrapper.addEventListener('touchstart', handleDragStart);
    wrapper.addEventListener('touchmove', handleDragMove);
    wrapper.addEventListener('touchend', handleDragEnd);

    wrapper.addEventListener('mousedown', handleDragStart);
    wrapper.addEventListener('mousemove', handleDragMove);
    wrapper.addEventListener('mouseup', handleDragEnd);
    wrapper.addEventListener('mouseleave', handleDragEnd);

    return () => {
      wrapper.removeEventListener('touchstart', handleDragStart);
      wrapper.removeEventListener('touchmove', handleDragMove);
      wrapper.removeEventListener('touchend', handleDragEnd);

      wrapper.removeEventListener('mousedown', handleDragStart);
      wrapper.removeEventListener('mousemove', handleDragMove);
      wrapper.removeEventListener('mouseup', handleDragEnd);
      wrapper.removeEventListener('mouseleave', handleDragEnd);
    };
  }, [wrapper, previousId, nextId]);

  return (
    <div className={styles.carousel}>
      <div ref={setWrapper} className={styles.wrapper}>
        <div key={previousId || 'previous-slide'} className={styles.slide}>
          {previousId ? <Slide slideId={previousId} /> : null}
        </div>

        <div key={currentId} className={styles.slide}>
          <Slide slideId={currentId} />
        </div>

        <div key={nextId || 'next-slide'} className={styles.slide}>
          {nextId ? <Slide slideId={nextId} /> : null}
        </div>
      </div>
    </div>
  );
};
