var express = require('express');
var router = express.Router();
const passport = require('passport');

const { verify } = require('../lib/verify_user');

const bcrypt = require('bcrypt');
const pool = require('../connection/database');

const saltRounds = 10;

router.post('/create_user', async (req, res) => {
    
    const { nombre, apellidos, email, password, rol} = req.body;

    pool.query(
        {
            sql: 'SELECT id FROM users WHERE email = ?',
            timeout: 30000, 
        },
        [email],
        (error, results, fields) => {

            if(results.length > 0){
                res.json({status: false, msg: "el email ingresado ya existe."});
            }
            else {
                
                bcrypt.genSalt(saltRounds, async function(err, salt) {
                    
                    bcrypt.hash(password, salt, async function(err, hash) {
                        pool.query(
                            {
                                sql: 'INSERT INTO users SET nombre=?, apellidos=?, email=?, password=?, rol=?',
                                timeout: 30000,
                            },
                            [nombre, apellidos, email, hash, rol],
                            (error, results, fields) =>{
                                if(error) {
                                    res.json({status: false, msg: "no se ha podido crear el usuario."});
                                }
                                else {
                                    res.json({status: true, msg: "se creo exitosamente el usuario: " + email + "."});
                                }
                            }
                        );
                    });
                });    
            }
        }
    );
});

router.post('/edit_user', async (req, res) => {
    const { id, email, password } = req.body;
    bcrypt.genSalt(saltRounds, async function(err, salt) {
                    
        bcrypt.hash(password, salt, async function(err, hash) {

            pool.query(
                {
                    sql: "UPDATE users SET password=? WHERE id=? AND email=?",
                    timeout: 30000,
                },
                [hash, id, email],
                (error, results, fields) => {
                    if(results.affectedRows == 0) {
                        res.json({status: false, msg: "no se ha podido editar la contraseña del usuario: " + email + "."});
                    }
                    else {
                        res.json({status: true, msg: "la contraseña se ha cambiado exitosamente."});
                    }
                }
            );
        });
    });
});

router.post('/delete_user', async (req, res) => {
    const { id, email } = req.body;

    pool.query(
        {
            sql: 'DELETE FROM users WHERE id=? AND email=?',
            timeout: 30000, 
        },
        [id, email],
        (error, results, fields) => {
            console.log(results.affectedRows);
            if(results.affectedRows == 0) {
                res.json({status: false, msg: "no se ha podido eliminar el usuario: " + email + "."});
            }
            else {
                res.json({status: true, msg: "se ha eliminado exitosamente al usuario: " + email +"."});
            }
        }
    );
});


router.post('/create_device', async (req, res) => {
    const { id_owner, name, socket_name, gps } = req.body;
    
    pool.query(
        {
            sql: "SELECT id FROM devices WHERE socket_name=? OR name=?",
            timeout: 30000
        },
        [socket_name, name],
        (error, results, fields) => {
            if(error) {
                res.json({status: false, msg: "error en la petición hacia la db."});
            }
            else {

                if(results.length > 0) {
                    res.json({status: false, msg: "ya existe un dispositivo con el nombre: " + name + "."});
                }
                else {
                    
                    if(!gps) {

                        const { latitud, longitud } = req.body;
                        pool.query(
                            {
                                sql: "INSERT INTO devices SET id_owner=?, socket_name=?, name=?, gps=false, gps_lat=?, gps_lng=?",
                                timeout: 30000,
                            },
                            [id_owner, socket_name, name, latitud, longitud],
                            (error, results, fields) => {

                                if(error) {
                                    res.json({status: false, msg: "error en la petición hacia la db."});
                                }
                                else {
                                    res.json({status: true, msg: "dispositivo" + name + ", creado exitosamente."});
                                }
                            }
                        );
                    }
                    else {
                        pool.query(
                            {
                                sql: "INSERT INTO devices SET id_owner=?, socket_name=?, gps=true",
                                timeout: 30000,
                            },
                            [],
                            (error, results, fields) => {

                                if(error) {
                                    res.json({status: false, msg: "error en la petición hacia la db."});
                                }
                                else {
                                    res.json({status: true, msg: "dispositivo" + name + ", creado exitosamente."});
                                }
                            }
                        );
                    }

                    res.json({status: true, msg: "dispositivo creado"});
                }
            }
        }
    );
});

router.post('/edit_device', async (req, res) => {

});

router.post('/delete_device', async (req, res) => {

});



module.exports = router;