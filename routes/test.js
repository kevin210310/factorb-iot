require('../config/mongoose/index');
const user = require('../config/mongoose/users');
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
router.post('/readtodb2', async (req, res) => {
    const Users = await user.findOne({ email: req.body.email }, function (err, response) {
        if(err){
            res.status(400).json({msg: "error en la peticion", status: false});
        }
        else {
            if(response == null){
                res.json({ msg: "no encontrado", status: false });
            }
            else {
                res.json({data: response, status: true});
            } 
        }
    });
});




router.post('/updatetodb', async (req, res) => {
    user.updateOne({'usuarios._id': "606c9fbaf06e2a1a188363a4"}, {$push: { "permisos": {"parmiso1": false}}}).exec();
    res.json({msg: "Update success"});
});

module.exports = router;