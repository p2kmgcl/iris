import Database from './Database';

const SCOPES = [
  'email',
  'offline_access',
  'openid',
  'profile',
  'User.Read',
  'Files.Read',
  'Files.Read.All',
];

const Authentication = {
  login: async (popupWindow: Window) => {
    const state = getRandomString(16);
    const codeVerifier = getRandomString(64);
    const codeChallenge = await getCodeChallenge(codeVerifier);
    const { clientId } = await Database.getConfiguration();

    localStorage.setItem(`authCodeVerifier--${state}`, codeVerifier);

    const url = new URL(
      'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize',
    );
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set(
      'redirect_uri',
      `${window.location.origin}/auth/redirection.html`,
    );
    url.searchParams.set('scope', SCOPES.join(' '));
    url.searchParams.set('response_mode', 'query');
    url.searchParams.set('state', state);
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('code_challenge_method', 'S256');

    popupWindow.location.href = url.toString();

    await new Promise((resolve) => {
      window.addEventListener('message', (event) => {
        if (event.data?.type === 'authReady' && event.data?.state === state) {
          Database.getConfiguration().then((readyConfiguration) => {
            resolve(readyConfiguration);
          });
        }
      });
    });
  },

  logout: async () => {
    await Database.setConfiguration({
      accessToken: '',
      accessTokenExpirationTime: 0,
      refreshToken: '',
      refreshTokenExpirationTime: 0,
    });

    window.location.reload();

    // Wait until window reloads
    return new Promise(() => {});
  },

  getFreshAccessToken: async () => {
    const now = Date.now();
    const {
      accessTokenExpirationTime,
      clientId,
      refreshToken,
      refreshTokenExpirationTime,
    } = await Database.getConfiguration();

    if (now >= refreshTokenExpirationTime) {
      console.error('NEEDS LOGIN');
    } else if (now >= accessTokenExpirationTime) {
      const formData = new FormData();
      formData.set('client_id', clientId);
      formData.set('grant_type', 'refresh_token');
      formData.set('scope', SCOPES.join(' '));
      formData.set('refresh_token', refreshToken);

      await requestAccessToken(formData);
    }

    return (await Database.getConfiguration()).accessToken;
  },

  getAuthToken: async (code: string, state: string) => {
    // Need to open database as this code might be executed
    // outside our application context
    await Database.open();

    const { clientId } = await Database.getConfiguration();
    const codeVerifier = localStorage.getItem(`authCodeVerifier--${state}`);

    if (!codeVerifier) {
      throw new Error('Invalid null codeVerifier');
    }

    localStorage.removeItem(`authCodeVerifier--${state}`);

    const formData = new FormData();
    formData.set('client_id', clientId);
    formData.set('grant_type', 'authorization_code');
    formData.set('code', code);
    formData.set('redirect_uri', `${location.origin}${location.pathname}`);
    formData.set('code_verifier', codeVerifier);

    await requestAccessToken(formData);

    window.opener.postMessage({
      type: 'authReady',
      state,
    });

    close();
  },
};

function getRandomString(length: number) {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join(
    '',
  );
}

async function getCodeChallenge(codeVerifier: string) {
  function sha256(str: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    return window.crypto.subtle.digest('SHA-256', data);
  }

  function base64urlencode(arrayBuffer: ArrayBuffer) {
    const chars = (new Uint8Array(arrayBuffer) as unknown) as number[];

    return btoa(String.fromCharCode.apply(null, chars))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  return base64urlencode(await sha256(codeVerifier));
}

async function requestAccessToken(formData: FormData) {
  const response = await fetch(
    'https://login.microsoftonline.com/consumers/oauth2/v2.0/token',
    {
      method: 'POST',
      body: formData,
    },
  );

  const json: Record<string, any> = await response.json();

  if (
    json.access_token &&
    json.id_token &&
    json.refresh_token &&
    json.expires_in
  ) {
    await Database.setConfiguration({
      accessToken: json.access_token,
      accessTokenExpirationTime: Date.now() + json.expires_in,
      refreshToken: json.refresh_token,
      refreshTokenExpirationTime: Date.now() + 1000 * 60 * 60 * 24,
    });
  }
}

export default Authentication;
