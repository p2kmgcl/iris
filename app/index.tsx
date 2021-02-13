import React, { FC, useEffect } from 'react';
import { render } from 'react-dom';
import { Database } from './utils/Database';
import { App } from './organisms/App';
import { Setup } from './organisms/Setup';
import { responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core';
import { yellow } from '@material-ui/core/colors';

const appElement = document.getElementById('app') as HTMLDivElement;

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

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
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

  const MainComponent = isSetupReady ? App : Setup;

  render(
    <Wrapper>
      <MainComponent />
    </Wrapper>,
    appElement,
  );
})();
