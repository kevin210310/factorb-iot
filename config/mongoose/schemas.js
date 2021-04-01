'use strict';

const moongose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
        nombre: {type: String},
        apellidos: {type: String},
        password: {type: String},
        email: {type: String},
        creado: {type: Date},
        modificacion: {type: Boolean},
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
            permiso9: {type: Boolean}
        },
        maquinas: {
            name: {type: String},
            status_gps: {type: Boolean},
            pos_lat: {type: Number},
            pos_lng: {type: Number},
            dispositivos: {
                socket_name: {type: String},
                name: {type: String},
                pos_lat: {type: Number},
                pos_lng: {type: Number},
                gps: {type: Boolean},
                sensores: {
                    type: {type: String},
                    mode: {type: String},
                    measure: {type: String},
                    name: {type: String},
                    description: {type: String},
                    max_measure: {type: Number},
                    min_measure: {type: Number},
                    set_point: {type: Number},
                    create_sensor: {type: Date},
                    max_alarm: {type: Number}, 
                    min_alarm: {type: Number},
                    alarm: {type: Boolean}
                }
            }
        }
    });

module.exports = moongose.model('users', userSchema);