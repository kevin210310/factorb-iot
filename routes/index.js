var express = require('express');
var router = express.Router();
const passport = require('passport');


router.get('/', function(req, res, next) {
  res.redirect('/login');
});
router.get('/login', function(req, res, next) {
  res.render('login', { 
    url: process.env.URL 
  });
});
router.post('/login', passport.authenticate('local'),function(req, res) {
  res.json({data: "ok"});
});
router.post('/logout', function(req, res){
  req.logout();
  res.render('login');
});

module.exports = router;
