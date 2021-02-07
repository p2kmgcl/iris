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
1. Install `openssl`
1. Run `./generate-development-certificate.sh` and import `build/development-certificate/localca.pem` to your system
1. Run `yarn start` to start a development server, or `yarn run build` to generate a production ready application in `build/app/`
