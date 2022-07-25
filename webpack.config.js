'use strict';

let path = require('path');

module.exports = {
  mode: 'development',
  entry: './js/script.js',
  output: {
    path: 'D:\\Study\\DOMAINS\\food\\js',
    filename: 'bundle.js'
  },
  watch: true,

  devtool: "source-map",

  module: {}
};
