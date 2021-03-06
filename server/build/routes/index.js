'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _post = require('./post');

var _post2 = _interopRequireDefault(_post);

var _get = require('./get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
router.use('/get', _get2.default);
router.use('/post', _post2.default);

exports.default = router;