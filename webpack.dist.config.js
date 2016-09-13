/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

const webpack = require('webpack');
const path = require('path');

const join    = path.join;
const resolve = path.resolve;

const root    = resolve(__dirname);
const src     = join(root, 'src');

module.exports = {
  debug: false,
  devtool: false,
  output: {
    path: __dirname + '/assets',
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  entry: './src/index.js',

  stats: {
    colors: true,
    reasons: false
  },

  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
          compressor: {
            screw_ie8: true,
            warnings: false
          },
          mangle: {
            screw_ie8: true
          },
          output: {
            comments: false,
            screw_ie8: true
          }
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()

  ],

  resolve:{
    root: root,
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
      test: /\.js$/,
      loaders: ['babel','eslint'],
      include: path.join(__dirname, 'src'),
      exclude: [/bower_components/, /node_modules/]
      }
    ]
  }
};
