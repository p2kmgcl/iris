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
  try {
    await Database.open();
    await registerServiceWorker();
    await Authentication.init();

    const isSetupReady =
      (await Authentication.isAuthenticated()) &&
      Object.values(await Database.getConfiguration()).every(
        (value) => !!value,
      );

    const MainComponent = isSetupReady ? LazyApp : LazySetup;

    render(
      <IconStyleContextProvider>
        <ScanContextProvider>
          <RouteContextProvider>
            <Suspense fallback={<>Loading...</>}>
              <MainComponent />
            </Suspense>
          </RouteContextProvider>
        </ScanContextProvider>
      </IconStyleContextProvider>,
      appElement,
    );
  } catch (error) {
    appElement.innerHTML = error.toString();
  }
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
