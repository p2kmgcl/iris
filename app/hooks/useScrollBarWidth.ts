import { useEffect, useState } from 'react';

export const useScrollBarWidth = () => {
  const [scrollBarWidth, setScrollBarWidth] = useState(0);

  useEffect(() => {
    const wrapper = document.createElement('div');
    const content = document.createElement('div');

    content.style.width = '100%';
    wrapper.style.width = '100%';
    wrapper.style.position = 'absolute';
    wrapper.style.top = '-9999px';
    wrapper.style.left = '-9999px';

    wrapper.appendChild(content);
    document.body.appendChild(wrapper);

    requestAnimationFrame(() => {
      const initialWidth = content.getBoundingClientRect().width;

      wrapper.style.overflowY = 'scroll';

      requestAnimationFrame(() => {
        const scrollWidth = content.getBoundingClientRect().width;

        wrapper.removeChild(content);
        document.body.removeChild(wrapper);

        setScrollBarWidth(initialWidth - scrollWidth);
      });
    });
  }, []);

  return scrollBarWidth;
};
