const Authentication = {
  init: async () => {
    console.log(process.env.AUTH_SCOPE);
  },

  isAuthenticated: async () => {
    return false;
  },

  login: async () => {
    throw new Error('No login');
  },

  logout: () => {
    window.location.reload();
    return new Promise(() => {});
  },

  getFreshAccessToken: async () => {
    return '';
  },
};

export default Authentication;
