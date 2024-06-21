const TerserPlugin = require('terser-webpack-plugin');
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

const plugins = [];

const optimization = {
  minimizer: [
    new TerserPlugin(),
  ],
};

module.exports = {
  entry,
  externals: [nodeExternals()],
  mode: 'production',
  module: aModule,
  optimization,
  output,
  plugins,
};
