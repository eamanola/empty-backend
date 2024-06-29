const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const entry = {
  index: ['./src/index.js'],
};

const output = {
  filename: 'index.bundle.js',
  path: `${__dirname}/dist`,
};

const aModule = {
  rules: [
    {
      exclude: [/node_modules/u],
      test: /\.js$/ui,
      use: {
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env'] },
      },
    },
  ],
};

const plugins = [
  new webpack.NormalModuleReplacementPlugin(/^node:/u, (resource) => {
    switch (resource.request) {
      case 'node:crypto':
      case 'node:dns/promises':
      case 'node:os':
        // eslint-disable-next-line no-param-reassign
        resource.request = resource.request.replace(/^node:/u, '');
        break;

      default:
        throw new Error(`${resource.request} not mapped in webpack.config`);
    }
  }),
];

const optimization = {
  minimizer: [new TerserPlugin()],
};

const resolve = {
  fallback: {
    'crypto': false,
    'dns/promises': false,
    'os': false,
  },
};


module.exports = {
  entry,
  externals: [nodeExternals()],
  mode: 'production',
  module: aModule,
  optimization,
  output,
  plugins,
  resolve,
};
