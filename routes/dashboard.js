var express = require('express');
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { verify } = require('../lib/verify_user');


//dashboard
router.get('/', verify, (req, res) => {

    if(req.user.user.rol == "administrador") {

        res.render('dashboard', {
            layout: 'template_dashboard', 
            value: false, 
            nombre: req.user.user.nombre,
            rol: req.user.user.rol,
            permisos: {ingenieria: true, prevencion: true, tecnico: true, gerencia: true},
            url: process.env.URL
        });

    } else if(req.user.user.rol == "ingenieria") {

        res.render('dashboard', {
            layout: 'template_dashboard', 
            value: false, 
            nombre: req.user.user.nombre,
            rol: req.user.user.rol,
            permisos: {ingenieria: true, prevencion: false, tecnico: false, gerencia: false},
            url: process.env.URL
        });

    } else if(req.user.user.rol == "prevencion") {

        res.render('dashboard', {
            layout: 'template_dashboard', 
            value: false, 
            nombre: req.user.user.nombre,
            rol: req.user.user.rol,
            permisos: {ingenieria: false, prevencion: true, tecnico: false, gerencia: false},
            url: process.env.URL
        });

    } else if(req.user.user.rol == "tecnico") {

        res.render('dashboard', {
            layout: 'template_dashboard', 
            value: false, 
            nombre: req.user.user.nombre,
            rol: req.user.user.rol,
            permisos: {ingenieria: false, prevencion: false, tecnico: true, gerencia: false},
            url: process.env.URL
        });
    } else if(req.user.user.rol == "gerencia") {

        res.render('dashboard', {
            layout: 'template_dashboard', 
            value: false, 
            nombre: req.user.user.nombre,
            rol: req.user.user.rol,
            permisos: {ingenieria: false, prevencion: false, tecnico: false, gerencia: true},
            url: process.env.URL
        });
    } else {
        res.render('error');
    }
});
//USUARIOS
router.get('/usuarios', (req, res) => {

    res.render('usuarios/usuarios', {
        layout: 'template_dashboard', 
        value: false, 
        nombre: "estatico",
        rol: "administrador",
        permisos: {ingenieria: true, prevencion: true, tecnico: true, gerencia: true},
        url: process.env.URL
    });

});
router.get('/usuarios/crear', (req, res) => {

    res.render('usuarios/crear_usuarios', {
        layout: 'template_dashboard', 
        value: false, 
        nombre: "estatico",
        rol: "administrador",
        permisos: {ingenieria: true, prevencion: true, tecnico: true, gerencia: true},
        url: process.env.URL
    });

});

//MAQUINAS
router.get('/maquinas', async (req, res) => {
    res.render('maquinas/maquinas', {
        layout: 'template_dashboard', 
        value: false, 
        nombre: "estatico",
        rol: "administrador",
        permisos: {ingenieria: true, prevencion: true, tecnico: true, gerencia: true},
        url: process.env.URL,
        id_user: "606db3fa1282c834d0c9651d"
    });
});
router.get('/maquinas/crear', async (req, res) => {
    res.render('maquinas/crear_maquinas', {
        layout: 'template_dashboard', 
        value: false, 
        nombre: "estatico",
        rol: "administrador",
        permisos: {ingenieria: true, prevencion: true, tecnico: true, gerencia: true},
        url: process.env.URL,
        id_user: "606db3fa1282c834d0c9651d"
    });
});

//DISPOSITIVOS
router.get('/dispositivos/crear/:id_machine', (req, res) => {
    res.render('dispositivos/crear_dispositivos', {
        layout: 'template_dashboard', 
        value: false, 
        nombre: "estatico",
        rol: "administrador",
        permisos: {ingenieria: true, prevencion: true, tecnico: true, gerencia: true},
        url: process.env.URL,
        id_user: "606db3fa1282c834d0c9651d",
        id_machine: req.params.id_machine,
        hola: "hola mundo"
    });
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



router.get('/d', async (req, res) => {
    res.render('dashboard', {
        layout: 'template_dashboard'
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
    res.render('rfid', {layout: 'template_dashboard'});
});

module.exports = router;
