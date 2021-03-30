require('../config/mongoose/index');
var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    res.json({msg: "welcome to the test"});
});

module.exports = router;