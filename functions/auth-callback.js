const getEnv = require('./util/get-env');
const { URLSearchParams } = require('url');
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const env = getEnv();
  const code = event.queryStringParameters.code;
  const state = event.queryStringParameters.state;

  if (!state) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: '"state" parameter was not found',
      }),
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: '"code" parameter was not found',
      }),
    };
  }

  try {
    const params = new URLSearchParams();

    params.set('code', code);
    params.set('scope', env.AUTH_SCOPE);
    params.set('client_id', env.AUTH_CLIENT_ID);
    params.set('grant_type', 'authorization_code');
    params.set('client_secret', env.AUTH_CLIENT_SECRET);
    params.set('redirect_uri', `${env.AUTH_HOST}/api/auth-callback`);

    const response = await fetch(`${env.AUTH_URI}/oauth2/v2.0/token`, {
      method: 'POST',
      body: params,
    });

    const data = {
      ...(await response.json()),
      state,
    };

    return {
      statusCode: 200,
      body: `
        <script>
          window.opener.postMessage(
            JSON.stringify(${JSON.stringify(data)})
          );
        </script>
      `,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error,
      }),
    };
  }
};
