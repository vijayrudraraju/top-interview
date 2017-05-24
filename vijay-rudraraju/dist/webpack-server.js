'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpack3 = require('../webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (PORT) {
  var server = new _webpackDevServer2.default((0, _webpack2.default)(_webpack4.default), {
    proxy: {
      '*': 'http://localhost:' + (PORT - 1)
    }
  });
  server.listen(PORT, 'localhost');
};