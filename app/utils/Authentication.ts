import pkg from '../../package.json';

const LOCAL_STORAGE_AUTH_KEY = `__${pkg.name}_auth__`;

let auth: {
  access_token: string;
  refresh_token: string;
  expiration_date: number;
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
    return !!auth;
  },

  login: async () => {
    const state = Math.random().toString().substr(2);

    const popup = window.open(
      `/api/auth-redirect?state=${encodeURIComponent(state)}`,
      '_blank',
    );

    await new Promise((resolve, reject) => {
      window.addEventListener('message', (event) => {
        popup?.close();

        try {
          const data = JSON.parse(event.data);

          if (data.state !== state) {
            throw new Error('Invalid auth state');
          }

          localStorage.setItem(
            LOCAL_STORAGE_AUTH_KEY,
            JSON.stringify({
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              expiration_date: Date.now() + data.expires_in * 900,
            }),
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  logout: () => {
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

        const data = await response.json();

        localStorage.setItem(
          LOCAL_STORAGE_AUTH_KEY,
          JSON.stringify({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expiration_date: Date.now() + data.expires_in * 900,
          }),
        );
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
