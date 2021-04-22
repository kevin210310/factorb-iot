'use strict';

const moongose = require('mongoose');
const Schema = moongose.Schema;

const userSchema = new Schema({
    nombre: {type: String},
    apellidos: {type: String},
    email: {type: String},
    pwd: {type: String},
    creado: {type: Date},
    token: {type: String},
    usado: {type: Boolean},
    rol: {type: String},
    permisos: {
        permiso1: {type: Boolean},
        permiso2: {type: Boolean},
        permiso3: {type: Boolean},
        permiso4: {type: Boolean},
        permiso5: {type: Boolean},
        permiso6: {type: Boolean},
        permiso7: {type: Boolean},
        permiso8: {type: Boolean},
        permiso9: {type: Boolean},
        permiso10: {type: Boolean}
    },
    maquinas: []
});

module.exports = moongose.model('users', userSchema);