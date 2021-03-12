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
            rol: req.user.user.rol
        });
    }
    else if(req.user.user.rol == "cliente iot") {
        res.render('dashboard/users/dashboard_users', {
            layout: 'dashboard_template', 
            value: false,
            nombre: req.user.user.nombre,
            rol: req.user.user.rol
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
        id: 10
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

router.get('/device/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    res.render('dashboard/device', {layout: 'dashboard_template', id: id});
});

module.exports = router;
