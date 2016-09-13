'use strict';

const webpack = require('webpack');
const path = require('path');

const join    = path.join;
const resolve = path.resolve;

const root    = resolve(__dirname);
const src     = join(root, 'src');

const entryFile  = join(src, 'index.js');


module.exports = {
  context:__dirname,
  output: {
    path: __dirname + '/assets',
    filename: 'bundle.js',
    publicPath: '/assets/'
  },

  cache: true,
  debug: true,
  devtool: false,
  entry: [
    'webpack-dev-server/client?http://localhost:8000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  resolve: {
      root: root,
      extensions: ['','.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new webpack.NormalModuleReplacementPlugin(/^google$/, 'node-noop'),

  ],
  module: {
    loaders: [
      {
      test: /\.js$/,
      loaders: ['babel','eslint'],
      include: path.join(__dirname, 'src'),
      exclude: /(node_modules|bower_components)/,
      }
   ]
  }

};
