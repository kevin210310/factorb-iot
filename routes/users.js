var express = require('express');
var router = express.Router();
const passport = require('passport');

const { device } = require('../lib/error_device');
const { verify } = require('../lib/verify_user');




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {usuario: 'Tommy Angelo'});
});

router.get('/test', function(req, res, next) {
  res.render('test', {layout: 'dashboard_template'});
});

module.exports = router;
