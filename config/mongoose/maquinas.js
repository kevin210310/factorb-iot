'use strict';

const moongose = require('mongoose');
const Schema = moongose.Schema;
const data2Schema = new Schema({
    created_at_origin: {type: Date}
});
const sensoresSchema = new Schema({
    type: {type: String},
    name: {type: String},
    measurement: {type: String},
    variable: {type: String},
    id_variable: {type: String},
    descripcion: {type: String},
    minSensor: {type: Number},
    maxSensor: {type: Number},
    url: {type: String},
    color: {type: String},
    controlable: {type: Boolean}
});
const dataSchema = new Schema({
    id_device: {type: String},
    name: {type: String},
    url: {type: String},
    sensores: [sensoresSchema],
    data: [data2Schema]
});
const machineSchema = new Schema({
    nombre: {type: String},
    creado: {type: Date},
    descripcion: {type: String},
    url: {type: String},
    ubicacion: {type: String},
    usuarios_permitidos: [String],
    dispositivos: [dataSchema],
    tracker: {
        type: Boolean,
        default: false
    }
});

module.exports = moongose.model('machines', machineSchema);