import CopyPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import webpack from 'webpack';
import path from 'path';

const DESTINATION_DIRECTORY = './build/app';

export default {
  entry: {
    app: './app/index.tsx',
    serviceWorker: './service-worker/index.ts',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, DESTINATION_DIRECTORY),
  },

  devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : false,

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.join(__dirname, 'app'),
          path.join(__dirname, 'service-worker'),
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-typescript',
                ['@babel/preset-react', { runtime: 'automatic' }],
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: [
                        'last 1 chrome version',
                        'last 1 firefox version',
                        'last 1 safari version',
                      ],
                    },
                  },
                ],
              ],
              plugins:
                process.env.NODE_ENV === 'development'
                  ? ['react-refresh/babel']
                  : [],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'app'),
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true } },
        ],
      },
      {
        test: /\.(png|svg)$/i,
        include: [
          path.join(__dirname, 'app'),
          path.join(__dirname, 'assets'),
          path.join(__dirname, 'static'),
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'static',
          to: path.resolve(__dirname, DESTINATION_DIRECTORY),
        },
        {
          from: 'functions/**/*.js',
          to: path.resolve(__dirname, DESTINATION_DIRECTORY),
        },
      ],
    }),

    new webpack.DefinePlugin({
      'process.env.AUTH_SCOPE': JSON.stringify(process.env.AUTH_SCOPE),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      importScriptsViaChunks: ['serviceWorker'],
      exclude:
        process.env.NODE_ENV === 'development'
          ? [/\.js$/]
          : [/^functions\/[^.]+\.js$/],
    }),

    ...(process.env.NODE_ENV === 'production'
      ? [
          new CompressionPlugin({
            test: /\.(js|css)$/i,
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

  devServer: {
    hot: true,
    port: 9000,
    contentBase: path.resolve(__dirname, DESTINATION_DIRECTORY),
  },

  ignoreWarnings: [
    {
      message: /Should not import the named export/,
    },
  ],
};
