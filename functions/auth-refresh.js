const getEnv = require('./util/get-env');
const { URLSearchParams } = require('url');
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const env = getEnv();
  let refreshToken = '';

  try {
    refreshToken = JSON.parse(event.body).refresh_token;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: '"refresh_token" was not found in request body',
      }),
    };
  }

  try {
    const params = new URLSearchParams();

    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', refreshToken);
    params.set('scope', env.AUTH_SCOPE);
    params.set('client_id', env.AUTH_CLIENT_ID);
    params.set('client_secret', env.AUTH_CLIENT_SECRET);

    const response = await fetch(`${env.AUTH_URI}/oauth2/v2.0/token`, {
      method: 'POST',
      body: params,
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.toString() : error,
      }),
    };
  }
};
