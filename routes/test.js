require('../config/mongoose/index');
const user = require('../config/mongoose/schemas');
var express = require('express');
var router = express.Router();
router.post('/', (req, res) => {
    res.json({msg: "welcome to the test"});
});

router.post('/savetodb', async (req, res) => {
    const Users = new user(req.body);
    await Users.save();
    res.json({msg: "welcome to the test"});
});

module.exports = router;