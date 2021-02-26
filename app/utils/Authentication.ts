import pkg from '../../package.json';

const LOCAL_STORAGE_AUTH_KEY = `__${pkg.name}_auth__`;

let auth: {
  access_token: string;
  refresh_token: string;
  expiration_date: number;
} = {
  access_token: '',
  refresh_token: '',
  expiration_date: 0,
};

const setAuth = (nextAuth: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) => {
  if (
    !nextAuth.access_token ||
    !nextAuth.refresh_token ||
    !nextAuth.expires_in
  ) {
    throw new Error(`Invalid auth ${JSON.stringify(nextAuth)}`);
  }

  const parsedAuth = {
    access_token: nextAuth.access_token,
    refresh_token: nextAuth.refresh_token,
    expiration_date: Date.now() + nextAuth.expires_in * 900,
  };

  localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(parsedAuth));
  auth = parsedAuth;
};

const Authentication = {
  init: async () => {
    try {
      auth = JSON.parse(localStorage.getItem(LOCAL_STORAGE_AUTH_KEY) as string);
    } catch (_error) {
      // noop
    }
  },

  isAuthenticated: async () => {
    return !!(
      auth.access_token &&
      auth.expiration_date &&
      auth.expiration_date
    );
  },

  login: async () => {
    const state = Math.random().toString().substr(2);

    const popup = window.open(
      `/api/auth-redirect?state=${encodeURIComponent(state)}`,
      '_blank',
    );

    await new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        window.removeEventListener('message', handleMessage);
        popup?.close();

        try {
          const data = JSON.parse(event.data);

          if (data.state !== state) {
            throw new Error('Invalid auth state');
          }

          setAuth(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      window.addEventListener('message', handleMessage);
    });
  },

  logout: () => {
    auth = {
      access_token: '',
      refresh_token: '',
      expiration_date: 0,
    };

    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    window.location.reload();

    // Wait until page reload
    return new Promise(() => {});
  },

  getFreshAccessToken: async () => {
    if (!(await Authentication.isAuthenticated())) {
      // User will be redirected
      await new Promise(() => {});
    }

    if (auth.expiration_date <= Date.now()) {
      try {
        const response = await fetch('/api/auth-refresh', {
          method: 'POST',
          body: JSON.stringify({
            refresh_token: auth.refresh_token,
          }),
        });

        setAuth(await response.json());
      } catch (_error) {
        console.log(_error);
        await new Promise(() => {});
        await Authentication.logout();
      }
    }

    return auth.access_token;
  },
};

export default Authentication;
