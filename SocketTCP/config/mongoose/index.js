'use strict';
const mongoose = require('mongoose');

mongoose.connect("mongodb://FactorBDevelopment:FB-15062021@localhost:27017/admin", {
    /*useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true*/
    useNewUrlParser: true, useUnifiedTopology: true
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de Conexión a la db.'));
db.once('open', function() {
  console.log('Conexion a la db Mongodb exitosa');
});

module.exports = mongoose;