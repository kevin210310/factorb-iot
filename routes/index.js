var express = require('express');
var router = express.Router();
const multer = require('multer');
const passport = require('passport');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

//var upload = multer({ dest: 'uploads/' })


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

router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  console.log(file);
  if (!file) {
    console.log("failed");
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  console.log("ok");
    res.json({msg: "ok"});
  
});

module.exports = router;
