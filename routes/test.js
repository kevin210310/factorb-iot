require('../config/mongoose/index');
const user = require('../config/mongoose/schemas');
var express = require('express');
const schemas = require('../config/mongoose/schemas');
var router = express.Router();

const Model = mongoose.model('userSchema', schemas);


router.post('/', (req, res) => {
    res.json({msg: "welcome to the test"});
});

router.post('/savetodb', (req, res) => {
    res.json({msg: "welcome to the test"});
});

module.exports = router;