var express = require('express');
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { verify } = require('../lib/verify_user');


//dashboard
router.get('/', verify, (req, res) => {
    if(req.user.user.rol == "administrador") {
        res.render('dashboard/admin/dashboard_admin', {
            layout: 'dashboard_template', 
            value: false, 
            nombre: req.user.user.nombre,
            rol: req.user.user.rol,
            url: process.env.URL
        });
    }
    else if(req.user.user.rol == "cliente iot") {
        res.render('dashboard/users/dashboard_users', {
            layout: 'dashboard_template', 
            value: false,
            nombre: req.user.user.nombre,
            rol: req.user.user.rol,
            url: process.env.URL
        });
    }
});


//users
router.get('/users', (req, res) => {
    res.render('dashboard/admin/users/users', {layout: 'dashboard_template'});
});
//create_user
router.get('/create_user_web', (req, res) => {
    res.render('dashboard/admin/users/create_user_web', {layout: 'dashboard_template'});
});

router.get('/create_user_mobile', (req, res) => {
    res.render('dashboard/admin/users/create_user_mobile', {layout: 'dashboard_template'});
});

//edit_user
router.get('/edit_user_web', (req, res) => {
    res.render('dashboard/admin/users/edit_user_web', {layout: 'dashboard_template'});
});

router.get('/edit_user_mobile', (req, res) => {
    res.render('dashboard/admin/users/edit_user_mobile', {layout: 'dashboard_template'});
});

router.get('/test', function(req, res, next) {
    res.render('test', {layout: 'dashboard_template'});
});


router.get('/historicos', function(req, res, next) {
    res.render('dashboard/users/historicos', {layout: 'dashboard_template'});
});

router.get('/control', function(req, res, next) {
    res.render('dashboard/users/control', {
        layout: 'dashboard_template',
        value: false, 
        nombre: "vin diesel",
        rol: "cliente iot",
        id: 10,
        url: process.env.URL
    });
});

router.get('/gps', function(req, res, next) {
    res.render('dashboard/users/gps/gps', {
        layout: 'dashboard_template',
        value: false, 
        nombre: "vin diesel",
        rol: "cliente iot",
        id: 10
    });
});


router.get('/trazabilidad', function(req, res, next) {
    res.render('dashboard/users/gps/trazabilidad', {layout: 'dashboard_template'});
});

router.get('/rutas', function(req, res, next) {
    res.render('test', {layout: 'dashboard_template'});
});

router.get('/device/:id/:socket_name', async (req, res) => {
    const { id, socket_name } = req.params;
    res.render('dashboard/device', {
        layout: 'dashboard_template', 
        id: id,
        socket_name: socket_name, 
        url: process.env.URL
    });
});



router.get('/d', verify, async (req, res) => {
    res.render('dashboard', {
        layout: 'template_dashboard'
    });
});
router.get('/maquinas', async (req, res) => {
    res.render('maquinas', {
        layout: 'template_dashboard',
        url: process.env.URL,
        id_user: "606db3fa1282c834d0c9651d"
    });
});

router.get('/dispositivos/:id_machine', (req, res) => {
    res.render('dispositivos', {
        layout: 'template_dashboard',
        url: process.env.URL,
        id_machine: req.params.id_machine,
        hola: "hola mundo"
    });
});


router.get('/tracker/:id', async (req,res) =>{
    res.render('tracker', {
        layout: 'template_dashboard',
        url: process.env.URL,
        id_user: "606db3fa1282c834d0c9651d",
        id_machine: req.params.id
    });
});

router.get('/datadevice/:id_device/:id_machine', async (req,res) =>{
    res.render('datadevice', {
        layout: 'template_dashboard',
        url: process.env.URL,
        id_user: "606db3fa1282c834d0c9651d",
        id_machine: req.params.id_machine,
        id_device: req.params.id_device
    });
});


router.get('/rfid', function(req, res, next) {
    res.render('rfid', {layout: 'dashboard_template'});
});

module.exports = router;
