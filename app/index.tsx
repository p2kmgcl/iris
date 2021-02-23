import './index.css';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import Database from './utils/Database';
import ScanContextProvider from './contexts/ScanContext';
import IconStyleContextProvider from './contexts/IconStyleContext';
import RouteContextProvider from './contexts/RouteContext';
import Authentication from './utils/Authentication';

const appElement = document.getElementById('app') as HTMLDivElement;

const LazyApp = React.lazy(() => import('./organisms/App'));
const LazySetup = React.lazy(() => import('./organisms/Setup'));

(async function () {
  await Database.open();
  await registerServiceWorker();

  const isSetupReady = await (async function () {
    const configuration = await Database.getConfiguration();
    return (
      Object.values(configuration).every((value) => !!value) &&
      !!(await Authentication.getFreshAccessToken())
    );
  })();

  const MainComponent = isSetupReady ? LazyApp : LazySetup;

  render(
    <IconStyleContextProvider>
      <ScanContextProvider>
        <RouteContextProvider>
          <Suspense fallback={<></>}>
            <MainComponent />
          </Suspense>
        </RouteContextProvider>
      </ScanContextProvider>
    </IconStyleContextProvider>,
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
