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


var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var APIRouter = require('./routes/API');
var dashboardRouter = require('./routes/dashboard');

const bcrypt = require('bcrypt');
const pool = require('./connection/database');

var app = express();

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

passport.use(new PassportLocal(async function (username, password, done){
    
    if(username == "test@factorb.cl" && password == "1234"){
      console.log("usuario: test@factorb.cl, se ha logueado exitosamente");
        return done(null, {id: 1, nombre: "FactorB", rol: "Administrador"});
    }
    else if(username == "user@factorb.cl" && password == "1234"){
      console.log("usuario: user@factorb.cl, se ha logueado exitosamente");
      return done(null, {id: 4, nombre: "User001", rol: "Cliente IoT"});
    }
    else {
        return done(null, false);
    }
  
    /*var email = username;
    var datos = await pool.query('SELECT id, password, nombre, rol FROM users WHERE email=?', [email]);
    if(datos.length == 0){
      return done(null, false);
    }
    else{
      if(password == datos[0].password){
        console.log("el usuario: ", datos[0].nombre, "se ha logueado a las ", (new Date()));
        return done(null, {id: datos[0].id, nombre: datos[0].nombre, rol: datos[0].rol});
      }
      return done(null, false);
    }*/
}));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(async function(id, done){
  //let datos = await pool.query('SELECT nombre, rol FROM users WHERE id=?', [id]);
  if(id == 1){
    done(null, {user: {nombre: "FactorB", rol: "Administrador"}});
  }
  else if(id == 4){
    done(null, {user: {nombre: "User001", rol:"Cliente IoT"}});
  }
});







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


app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/api', APIRouter);

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
