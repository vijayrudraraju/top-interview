'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (PORT) {
  var app = (0, _express2.default)();

  app.use(_express2.default.static(__dirname + '/dist'));

  app.use(_bodyParser2.default.urlencoded({ extended: true }));
  app.use(_bodyParser2.default.json());

  var router = _express2.default.Router();
  var db = (0, _lowdb2.default)('db.json');
  db.defaults({ users: {} });

  router.post('/user', function (req, res) {
    console.log('POST', '/user', req.body);
    var exists = db.get('users').find({ user_name: req.body.user_name }).value();
    console.log('POST', '/user', 'exists', exists === undefined);
    res.json({ message: 'Success' });
  });
  app.use('/api', router);

  console.log('json-api-server', 'PORT', PORT);

  app.listen(PORT);
};