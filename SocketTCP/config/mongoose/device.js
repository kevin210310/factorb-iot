const moongose = require('mongoose');
const Schema = moongose.Schema;

const dataSchema = new Schema({
    lat: {type: Number},
    lng: {type: Number},
    bat: {type: Number},
    wifi: {type: Number},
    grade: {type: Number},
    speed: {type: Number},
    status_gps: {type: Boolean},
    time: {type: Date}
});

const deviceSchema = new Schema({
    name: {type: String},
    imei: {type: Number},
    data: [dataSchema]
});

module.exports = moongose.model('devices', deviceSchema);