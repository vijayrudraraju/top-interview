'use strict';

var _webpackServer = require('./webpack-server');

var _webpackServer2 = _interopRequireDefault(_webpackServer);

var _jsonApiServer = require('./json-api-server');

var _jsonApiServer2 = _interopRequireDefault(_jsonApiServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 8080;
var PROD = process.env.NODE_ENV === 'production';

if (PROD) {
  (0, _jsonApiServer2.default)(PORT);
} else {
  (0, _jsonApiServer2.default)(PORT - 1);
  (0, _webpackServer2.default)(PORT);
}