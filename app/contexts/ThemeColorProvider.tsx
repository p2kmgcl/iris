import { FC, useEffect } from 'react';

export const ThemeColorProvider: FC = ({ children }) => {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const themeColorElement = document.querySelector('[name=theme-color]');
    const statusBarStyleElement = document.querySelector(
      '[name=apple-mobile-web-app-status-bar-style]',
    );

    if (!themeColorElement || !statusBarStyleElement) {
      return;
    }

    const toBase16 = (s: string) =>
      parseInt(s, 10).toString(16).padStart(2, '0');

    const applyColorTheme = () => {
      const rgbRegExp = /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i;
      const isDark = mediaQuery.matches;
      let { backgroundColor } = window.getComputedStyle(document.body);

      if (rgbRegExp.test(backgroundColor)) {
        const [, r, g, b] = rgbRegExp.exec(backgroundColor) as string[];
        backgroundColor = `#${toBase16(r)}${toBase16(g)}${toBase16(b)}`;
      } else {
        backgroundColor = isDark ? '#272833' : '#ffffff';
      }

      themeColorElement.setAttribute('content', backgroundColor);

      statusBarStyleElement.setAttribute(
        'content',
        isDark ? 'black-translucent' : 'default',
      );
    };

    applyColorTheme();
    mediaQuery.addEventListener('change', applyColorTheme);

    return () => {
      mediaQuery.removeEventListener('change', applyColorTheme);
    };
  }, []);

  return <>{children}</>;
};
