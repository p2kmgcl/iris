import CopyPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import webpack from 'webpack';
import path from 'path';

const DESTINATION_DIRECTORY = './build/app';

export const cssRule = {
  test: /\.css$/,
  include: path.join(__dirname, 'app'),
  use: ['style-loader', { loader: 'css-loader', options: { modules: true } }],
};

export const jsRule = {
  test: /\.tsx?$/,
  include: path.join(__dirname, 'app'),
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
};

export const urlRule = {
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
};

export const rules = [cssRule, jsRule, urlRule];

export const plugins = [
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
];

export const productionPlugins = [
  new CompressionPlugin({
    test: /\.(js|css)$/i,
  }),

  new WorkboxPlugin.GenerateSW({
    clientsClaim: true,
    skipWaiting: true,
    exclude: ['CNAME'],
  }),
];

export const developmentPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin(),
];

export const devtool =
  process.env.NODE_ENV === 'development' ? 'eval-source-map' : false;

const devServer: Record<string, any> = {
  hot: true,
  port: 9000,
  contentBase: path.resolve(__dirname, DESTINATION_DIRECTORY),
};

export default {
  entry: {
    app: './app/index.tsx',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, DESTINATION_DIRECTORY),
  },
  devtool,
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    ...(process.env.NODE_ENV === 'production' ? productionPlugins : []),
    ...(process.env.NODE_ENV === 'development' ? developmentPlugins : []),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  ...(process.env.NODE_ENV === 'development' ? { devServer } : {}),
  ignoreWarnings: [
    {
      message: /Should not import the named export/,
    },
  ],
};
