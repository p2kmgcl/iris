import CopyPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import webpack from 'webpack';
import fs from 'fs';
import path from 'path';

const DESTINATION_DIRECTORY = './build/app';
const CERTIFICATE_DIRECTORY = './build/development-certificate';

export default {
  entry: {
    app: './app/index.tsx',
    'auth-redirection': './app/auth-redirection.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, DESTINATION_DIRECTORY),
  },
  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true } },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-react',
              [
                '@babel/preset-env',
                {
                  targets: ['last 2 Chrome versions', 'last 2 iOS versions'],
                },
              ],
            ],
            plugins: [
              ...(process.env.NODE_ENV === 'development'
                ? [require.resolve('react-refresh/babel')]
                : []),
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'static', to: path.resolve(__dirname, DESTINATION_DIRECTORY) },
      ],
    }),

    ...(process.env.NODE_ENV === 'production'
      ? [
          new CompressionPlugin({
            test: /\.(js|css)$/i,
          }),

          new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            exclude: ['CNAME'],
          }),
        ]
      : []),

    ...(process.env.NODE_ENV === 'development'
      ? [
          new webpack.HotModuleReplacementPlugin(),
          new ReactRefreshWebpackPlugin(),
        ]
      : []),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        devServer: {
          hot: true,
          host: '0.0.0.0',
          https: {
            key: fs.readFileSync(
              path.resolve(__dirname, CERTIFICATE_DIRECTORY, './localhost.key'),
            ),
            cert: fs.readFileSync(
              path.resolve(__dirname, CERTIFICATE_DIRECTORY, './localhost.crt'),
            ),
            ca: fs.readFileSync(
              path.resolve(__dirname, CERTIFICATE_DIRECTORY, './localca.pem'),
            ),
          },
          port: 9000,
          contentBase: path.resolve(__dirname, DESTINATION_DIRECTORY),
        },
      }
    : {}),
};