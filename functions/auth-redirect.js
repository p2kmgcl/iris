const getEnv = require('./util/get-env');
const { URL } = require('url');

exports.handler = async function (event, context, callback) {
  const state = event.queryStringParameters.state;

  if (!state) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: '"state" parameter was not found',
      }),
    };
  }

  try {
    const env = getEnv();
    const url = new URL(`${env.AUTH_URI}/oauth2/v2.0/authorize`);

    url.searchParams.set('client_id', env.AUTH_CLIENT_ID);
    url.searchParams.set('redirect_uri', `${env.AUTH_HOST}/api/auth-callback`);
    url.searchParams.set('scope', env.AUTH_SCOPE);
    url.searchParams.set('state', state);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('response_mode', 'query');

    return callback(null, {
      statusCode: 302,
      headers: {
        Location: url,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error,
      }),
    };
  }
};
