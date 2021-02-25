var express = require('express');
var router = express.Router();
const passport = require('passport');

const { verify } = require('../lib/verify_user');


//dashboard
router.get('/', verify, (req, res) => {
    console.log("entramos papi", req.user.user.rol);
    if(req.user.user.rol == "Administrador") {
        res.render('dashboard/admin/dashboard_admin', {layout: 'dashboard_template'});
    }
    else if(req.user.user.rol == "Cliente IoT") {
        res.render('dashboard/users/dashboard_users', {layout: 'dashboard_template'});
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
    res.render('dashboard/users/control', {layout: 'dashboard_template'});
});


module.exports = router;
