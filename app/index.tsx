import './index.css';
import React, { FC, Suspense } from 'react';
import { render } from 'react-dom';
import { Database } from './utils/Database';
import { responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core';
import { yellow } from '@material-ui/core/colors';
import { ScanContextProvider } from './contexts/ScanContext';
import { IconStyleContextProvider } from './contexts/IconStyleContext';

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
  return (
    <IconStyleContextProvider>
      <ThemeProvider theme={theme}>
        <ScanContextProvider>{children}</ScanContextProvider>
      </ThemeProvider>
    </IconStyleContextProvider>
  );
};

(async function () {
  await Database.open();
  await registerServiceWorker();

  const isSetupReady = await (async function () {
    const configuration = await Database.getConfiguration();
    return Object.values(configuration).every((value) => !!value);
  })();

  const MainComponent = isSetupReady ? LazyApp : LazySetup;

  render(
    <Wrapper>
      <Suspense fallback={<></>}>
        <MainComponent />
      </Suspense>
    </Wrapper>,
    appElement,
  );
})();

async function registerServiceWorker() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    return navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('SW registered');
      })
      .catch((registrationError) => {
        console.error('SW registration failed: ', registrationError);
      });
  }
}
