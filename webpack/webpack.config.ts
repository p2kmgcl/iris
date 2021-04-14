import CopyPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import webpack from 'webpack';
import path from 'path';

const APP_DIRECTORY = path.join(__dirname, '../app');
const ASSETS_DIRECTORY = path.join(__dirname, '../assets');
const STATIC_DIRECTORY = path.join(__dirname, '../static');
const SW_DIRECTORY = path.join(__dirname, '../service-worker');
const DESTINATION_DIRECTORY = path.resolve(__dirname, '../build/app');
const IS_DEV = process.env.NODE_ENV === 'development';

export default {
  entry: {
    app: './app/index.tsx',
    serviceWorker: './service-worker/index.ts',
  },

  output: {
    filename: '[name].js',
    path: DESTINATION_DIRECTORY,
  },

  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'eval-source-map' : false,

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [APP_DIRECTORY, SW_DIRECTORY],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                '@babel/preset-typescript',
                ['@babel/preset-react', { runtime: 'automatic' }],
                ['@babel/preset-env', { targets: 'defaults' }],
              ],
              plugins: IS_DEV
                ? ['@babel/plugin-transform-runtime', 'react-refresh/babel']
                : ['@babel/plugin-transform-runtime'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: APP_DIRECTORY,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentContext: APP_DIRECTORY,
                localIdentName: IS_DEV
                  ? '[path][name]__[local]--[hash:base64:4]'
                  : '[hash:base64]',
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg)$/i,
        include: [APP_DIRECTORY, ASSETS_DIRECTORY, STATIC_DIRECTORY],
        use: [{ loader: 'url-loader', options: { limit: 8192 } }],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'static', to: DESTINATION_DIRECTORY },
        { from: 'functions/**/*.js', to: DESTINATION_DIRECTORY },
      ],
    }),

    new webpack.DefinePlugin({
      'process.env.AUTH_SCOPE': JSON.stringify(process.env.AUTH_SCOPE),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      mode: IS_DEV ? 'development' : 'production',
      sourcemap: !IS_DEV,
      importScriptsViaChunks: ['serviceWorker'],
      exclude: IS_DEV
        ? [/\.(css|js|json|png|html)$/]
        : [/^functions\/[^.]+\.js$/],
    }),

    ...(IS_DEV
      ? [
          new webpack.HotModuleReplacementPlugin(),
          new ReactRefreshWebpackPlugin(),
        ]
      : [new CompressionPlugin({ test: /\.(js|css)$/i })]),
  ],

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  devServer: {
    hot: true,
    port: 9000,
    contentBase: DESTINATION_DIRECTORY,
  },
};
