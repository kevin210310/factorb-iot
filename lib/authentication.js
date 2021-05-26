const passport = require('passport');
const PassportLocal = require('passport-local').Strategy;

passport.use( new PassportLocal( async function (username, password, done) {  

    if(username == "administrador@factorb.cl" && password == "1234") {

        return done(null, {id: 1, nombre: "administrador", rol: "administrador"}); 
    
    } else if(username == "gerencia@factorb.cl" && password == "1234") {

        return done(null, {id: 2, nombre: "lorenzo pardo muñoz", rol: "gerencia"});
  
    } else if(username == "ingenieria@factorb.cl" && password == "1234") {

        return done(null, {id: 3, nombre: "julio mozo lasheras", rol: "ingenieria"});
  
    } else if(username == "tecnico@factorb.cl" && password == "1234") {

        return done(null, {id: 4, nombre: "enrique larrañaga ceron", rol: "tecnico"});
  
    } else if(username == "prevencion@factorb.cl" && password == "1234") {

        return done(null, {id: 5, nombre: "domingo casanova raya", rol: "prevencion"});
  
    } else {

        return done(null, false);
    
    }
}));
  
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done){
    if(id == 1) {

        done(null, {user: {nombre: "administrador", rol: "administrador"}}); 
    
    } else if(id == 2) {

        done(null, {user: {nombre: "lorenzo pardo muñoz", rol: "gerencia"}});
  
    } else if(id == 3) {

        done(null, {user: {nombre: "julio mozo lasheras", rol: "ingenieria"}});
  
    } else if(id == 4) {

        done(null, {user: {nombre: "enrique larrañaga ceron", rol: "tecnico"}});
  
    } else if(id == 5) {

        done(null, {user: {nombre: "domingo casanova raya", rol: "prevencion"}});
  
    } else {

        done(null, false);
    
    }
  });