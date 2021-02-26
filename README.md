> **⚠️🚨☠️ STOP THERE!**
>
> This project is not ready to be used and might break your system, or maybe not, but you should wait a bit more.
> I am still experimenting and testing how it should work, everything can suddenly change.

# Iris

The missing OneDrive gallery.

## Setup

1. Install `NodeJS` and `Yarn` (check versions in `package.json > engines`)
1. Clone repository and `cd` into it
1. Copy `env.default.json` to `env.json` and fill missing fields
1. Run `yarn` to install dependencies
1. (optional) Run `npx netlify-cli link` to link netlify project
1. (optional) Create a `functions/.env.json` file and add development environment variables
1. Run `yarn start` to start a development server, or `yarn run build` to generate a production ready application in `build/app/`

### Required environment variables

- `AUTH_CLIENT_ID`: Azure application client id
- `AUTH_CLIENT_SECRET`: Azure application generated client secret
- `AUTH_SCOPE`: Space separated scopes that need to be accessed (`email offline_access openid profile User.Read Files.Read Files.Read.All`)
- `AUTH_URI`: Azure application base URI (`https://login.microsoftonline.com/consumers` or `tenant id`, see Azure documentation)
- `AUTH_HOST`: Application base URI (ex. `http://localhost:8888`)

> _Warning_: The backend authentication process needs `AUTH_HOST` environment variable
> to be pointing to the netlify server host, so it needs to be overridden for production/development environments.
