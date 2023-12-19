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
      test: /\.js$/i,
      exclude: [/node_modules/],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
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
  mode: 'production',
  entry,
  output,
  module: aModule,
  plugins,
  optimization,
  // externalsPresets: { node: true },
  externals: [nodeExternals()],
};
