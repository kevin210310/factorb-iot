if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}


const serveIndex = require('serve-index');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
require('./config/mongoose/index');
const user = require('./config/mongoose/users');
var authentication = require('./lib/authentication');
var indexRouter = require('./routes/index');
var APIRouter = require('./routes/API');
var dashboardRouter = require('./routes/dashboard');
var testRouter = require('./routes/test');
const bcrypt = require('bcrypt');
const pool = require('./connection/database');

var app = express();
require('events').EventEmitter.prototype._maxListeners = 50;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//LOGIN SESION USANDO PASSPORT
app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true

}));
app.use(passport.initialize());
app.use(passport.session());

require('./lib/authentication');



// SET STORAGE



app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/materialize', express.static(__dirname + '/node_modules/materialize-css/dist/'));
app.use('/client-socket', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/toastr', express.static(__dirname + '/node_modules/toastr/build/'));
app.use('/gridstack', express.static(__dirname + '/node_modules/gridstack/dist/'));
app.use('/validator', express.static(__dirname + '/node_modules/validator/'));
app.use(bodyParser.urlencoded({extended: true}))


app.use('/ftp', express.static('public'), serveIndex('public/images', {icons: true}))
app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/api', APIRouter);
app.use('/test', testRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
