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
router.post('/readtodb', async (req, res) => {
    const Users = await user.find();
    res.json({Users});
});
router.post('/updatetodb', async (req, res) => {
    user.updateOne({'usuarios._id': "606c9fbaf06e2a1a188363a4"}, {$push: { "permisos": {"parmiso1": false}}}).exec();
    res.json({msg: "Update success"});
});

module.exports = router;