import { Authentication } from './utils/Authentication';

const url = new URL(location.href);
const code = url.searchParams.get('code');
const state = url.searchParams.get('state');
const errorName = url.searchParams.get('error');
const errorDescription = url.searchParams.get('error_description');

// Check state

if (code && state) {
  Authentication.getAuthToken(code, state).catch((error: Error) => {
    document.body.innerHTML = `
      <p><strong>Error</strong>: ${error.toString()}</p>
    `;
  });
} else if (errorName) {
  document.body.innerHTML = `
    <p><strong>Error</strong>: errorName}</p>
    <p><strong>Description</strong>: ${errorDescription || ''}</p>
  `;
} else {
  document.body.innerHTML = '????';
}
