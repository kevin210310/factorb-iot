'use strict';

const moongose = require('mongoose');
const Schema = moongose.Schema;
const dataSchema = new Schema({
    id_device: {type: String},
    gps: {type: Boolean}
});
const machineSchema = new Schema({
    nombre: {type: String},
    creado: {type: Date},
    descripcion: {type: String},
    url: {type: String},
    ubicacion: {type: String},
    usuarios_permitidos: [String],
    dispositivos: [dataSchema]
});

module.exports = moongose.model('machines', machineSchema);