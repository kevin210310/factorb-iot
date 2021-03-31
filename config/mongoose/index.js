'use strict';
const mongoose = require('mongoose');

mongoose.connect(process.env.URLdb, {
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