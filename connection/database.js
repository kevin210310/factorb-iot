const mysql = require('mysql');
const { promisify }= require('util');
const { database } = require('./keys');
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('La conexion con la base de datos se ha cerrado');
      return;
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Se excedieron las conexiones permitidas');
      return;
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('La conexion con la base de datos fue rechazada');
      return;
    }
  }

  if (connection) connection.release();
  console.log('<=== Conexion con la db exitosa ===>');
  return;
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;
