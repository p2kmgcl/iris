import React, { FC, Suspense, useEffect } from 'react';
import { render } from 'react-dom';
import { Database } from './utils/Database';
import { responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core';
import { yellow } from '@material-ui/core/colors';
import { ScanContextProvider } from './contexts/ScanContext';

const appElement = document.getElementById('app') as HTMLDivElement;

const LazyApp = React.lazy(() =>
  import('./organisms/App').then(({ App }) => ({ default: App })),
);

const LazySetup = React.lazy(() =>
  import('./organisms/Setup').then(({ Setup }) => ({ default: Setup })),
);

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      background: {
        default: '#111',
        paper: '#222',
      },

      primary: {
        main: yellow['500'],
      },

      type: 'dark',
    },

    typography: {
      fontFamily: `
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans,
        Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
      `,
      fontSize: 16,
    },
  }),
);

const Wrapper: FC = ({ children }) => {
  useEffect(() => {
    appElement.style.fontFamily = theme.typography.fontFamily as string;
    appElement.style.fontSize = `${theme.typography.fontSize}px`;
    appElement.style.backgroundColor = theme.palette.background.default;
    appElement.style.color = theme.palette.text.primary;
    appElement.style.height = '100%';
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ScanContextProvider>{children}</ScanContextProvider>
    </ThemeProvider>
  );
};

(async function () {
  await Database.open();

  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.error('SW registration failed: ', registrationError);
      });
  }

  const isSetupReady = await (async function () {
    const configuration = await Database.getConfiguration();
    return Object.values(configuration).every((value) => !!value);
  })();

  document.body.style.margin = '0';
  document.body.style.height = '100vh';
  document.body.style.overflow = 'hidden';

  const MainComponent = isSetupReady ? LazyApp : LazySetup;

  render(
    <Wrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <MainComponent />
      </Suspense>
    </Wrapper>,
    appElement,
  );
})();
