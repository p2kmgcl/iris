import './index.css';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import Database from './utils/Database';
import ScanContextProvider from './contexts/ScanContext';
import Authentication from './utils/Authentication';
import App from './organisms/App';
import { ThemeColorProvider } from './contexts/ThemeColorProvider';

const appElement = document.getElementById('app') as HTMLDivElement;
const LazyApp = React.lazy(() => Promise.resolve({ default: App }));
const LazySetup = React.lazy(() => import('./organisms/Setup'));

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker
      .register('/service-worker.js')
      .catch((registrationError) => {
        console.error('SW registration failed: ', registrationError);
      });
  }
}

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
      <ScanContextProvider>
        <ThemeColorProvider>
          <Suspense fallback={<></>}>
            <MainComponent />
          </Suspense>
        </ThemeColorProvider>
      </ScanContextProvider>,
      appElement,
    );
  } catch (error) {
    appElement.innerHTML = error.toString();
  }
})();
