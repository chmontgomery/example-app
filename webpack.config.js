var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var OUT_DIR = path.resolve(__dirname, 'public');
var FROM_DIR = path.resolve(__dirname, 'src/content');

var config = {
  entry: FROM_DIR + '/entry.js',
  output: {
    path: OUT_DIR,
    filename: 'main.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : FROM_DIR,
        loader : 'babel'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('main.css', {
      allChunks: true
    })
  ]
};

module.exports = config;
