import './index.css';
import React from 'react';
import { render } from 'react-dom';
import { Database } from './utils/Database';
import { App } from './organisms/App';
import { Setup } from './organisms/Setup';

(async function () {
  await Database.open();

  const isSetupReady = await (async function () {
    const configuration = await Database.getConfiguration();
    return Object.values(configuration).every((value) => !!value);
  })();

  const MainComponent = isSetupReady ? App : Setup;
  render(<MainComponent />, document.getElementById('app'));
})();
