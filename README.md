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

## Thoughts

### Why not using a CSS/Styles/Components library?

I love writing CSS, and you learn lots of things doing that. For company/time-money-driven projects it might be too expensive (sometimes), but for personal projects it's very fun.

### What about `react-window`/`react-virtualized`?

I tried using them, but I found that the usecases I am trying to develop here are quite specific. I don't think it makes sense to include a generic library like `react-virtualized` if the resulting code is more or less equal. `react-window`, on the other hand, doesn't solve the windowscroller behavior that I want to implement (there is a [documented issue](https://github.com/bvaughn/react-window/issues/30) about this). When I tried using both of them I ended up with too many -empty- elements being rendered, and the result was laggy.

### About IndexedDB performance and image storage

Currently I have a `PhotoModel` entity inside my database that keeps image information (ex. `itemId`) and the image data itself all together. _Maybe_ splitting this information will allow me to load the whole list of indexes, so I can resuse DOM elements: https://github.com/p2kmgcl/iris/blob/master/app/atoms/Grid.tsx#L116
