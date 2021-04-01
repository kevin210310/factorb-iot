var express = require('express');
var router = express.Router();
const iot = require('@google-cloud/iot');
const passport = require('passport');

const { verify } = require('../lib/verify_user');

const bcrypt = require('bcrypt');
const pool = require('../connection/database');
const { suppressDeprecationWarnings } = require('moment');

const saltRounds = 10;

const multer = require('multer');
const upload = multer({dest: './archivos'});

router.post('/historicos', async (req, res) => {
  const { fecha_desde, fecha_hasta} = req.body;
  console.log(req.body);
  pool.query(
    {
        sql: 'SELECT temp, time FROM gps WHERE time BETWEEN ? AND ?',
        timeout: 30000, 
    },
    [fecha_desde, fecha_hasta],
    (error, results, fields) => {

       res.json({data: results});
    }
);

});
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
    console.log(req.body);
    pool.query(
        {
            sql: "SELECT id FROM devices WHERE socket_name=? OR name=?",
            timeout: 30000
        },
        [socket_name, name],
        (error, results, fields) => {
            if(error) {
                console.log("aqui esta el error");
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
                                sql: "INSERT INTO devices SET id_owner=?, socket_name=?, name=?, gps=false, pos_lat=?, pos_lng=?",
                                timeout: 30000,
                            },
                            [id_owner, socket_name, name, latitud, longitud],
                            (error, results, fields) => {

                                if(error) {
                                    res.json({status: false, msg: "error en la petición hacia la db."});
                                }
                                else {
                                    res.json({status: true, msg: "dispositivo " + name + ", creado exitosamente."});
                                }
                            }
                        );
                    }
                    else {
                        pool.query(
                            {
                                sql: "INSERT INTO devices SET id_owner=?, socket_name=?, name=?, gps=true",
                                timeout: 30000,
                            },
                            [id_owner, socket_name, name],
                            (error, results, fields) => {

                                if(error) {
                                    res.json({status: false, msg: "error en la petición hacia la db 11."});
                                }
                                else {
                                    res.json({status: true, msg: "dispositivo" + name + ", creado exitosamente."});
                                }
                            }
                        );
                    }
                }
            }
        }
    );
});

router.post('/edit_device', async (req, res) => {

});

router.post('/delete_device', async (req, res) => {

});


router.post('/search_devices', async (req, res) => {
    const { id } = req.body;

    pool.query(
        {
            sql: "SELECT * FROM devices WHERE id_owner=?",
            timeout: 30000,
        },
        [id],
        (error, results, fields) => {
            if(error) {
                res.json({status: false, msg: "error en la petición a la db"});
            }
            else {
                res.json({status: true, msg: "dispositivos recuperados", data: results});
            }
        }
    );
});

router.post('/search_sensors', async (req, res) => {
    const { id } = req.body;

    pool.query(
        {
            sql: "SELECT * FROM sensors WHERE id_device_owner=?",
            timeout: 30000,
        },
        [id],
        (error, results, fields) => {
            if(error) {
                res.json({status: false, msg: "error en la petición a la db"});
            }
            else {
                res.json({status: true, msg: "sensores recuperados", data: results});
            }
        }
    );
});

router.get('/get_users', async (req, res) => {
    pool.query(
        {
            sql: "SELECT id, nombre, apellidos, email FROM users",
            timeout: 30000,
        },
        [],
        (error, results, fields) => {
            if(error) {
                res.json({status: false, msg: "petición hacia la base de datos erronea."});
            }
            else {
                let datos = {
                    "data": [
                      [
                        "Tiger Nixon",
                        "System Architect",
                        "Edinburgh",
                        "5421",
                        "2011/04/25",
                        "$320,800"
                      ],
                      [
                        "Garrett Winters",
                        "Accountant",
                        "Tokyo",
                        "8422",
                        "2011/07/25",
                        "$170,750"
                      ],
                      [
                        "Ashton Cox",
                        "Junior Technical Author",
                        "San Francisco",
                        "1562",
                        "2009/01/12",
                        "$86,000"
                      ],
                      [
                        "Cedric Kelly",
                        "Senior Javascript Developer",
                        "Edinburgh",
                        "6224",
                        "2012/03/29",
                        "$433,060"
                      ],
                      [
                        "Airi Satou",
                        "Accountant",
                        "Tokyo",
                        "5407",
                        "2008/11/28",
                        "$162,700"
                      ],
                      [
                        "Brielle Williamson",
                        "Integration Specialist",
                        "New York",
                        "4804",
                        "2012/12/02",
                        "$372,000"
                      ],
                      [
                        "Herrod Chandler",
                        "Sales Assistant",
                        "San Francisco",
                        "9608",
                        "2012/08/06",
                        "$137,500"
                      ],
                      [
                        "Rhona Davidson",
                        "Integration Specialist",
                        "Tokyo",
                        "6200",
                        "2010/10/14",
                        "$327,900"
                      ],
                      [
                        "Colleen Hurst",
                        "Javascript Developer",
                        "San Francisco",
                        "2360",
                        "2009/09/15",
                        "$205,500"
                      ],
                      [
                        "Sonya Frost",
                        "Software Engineer",
                        "Edinburgh",
                        "1667",
                        "2008/12/13",
                        "$103,600"
                      ],
                      [
                        "Jena Gaines",
                        "Office Manager",
                        "London",
                        "3814",
                        "2008/12/19",
                        "$90,560"
                      ],
                      [
                        "Quinn Flynn",
                        "Support Lead",
                        "Edinburgh",
                        "9497",
                        "2013/03/03",
                        "$342,000"
                      ],
                      [
                        "Charde Marshall",
                        "Regional Director",
                        "San Francisco",
                        "6741",
                        "2008/10/16",
                        "$470,600"
                      ],
                      [
                        "Haley Kennedy",
                        "Senior Marketing Designer",
                        "London",
                        "3597",
                        "2012/12/18",
                        "$313,500"
                      ],
                      [
                        "Tatyana Fitzpatrick",
                        "Regional Director",
                        "London",
                        "1965",
                        "2010/03/17",
                        "$385,750"
                      ],
                      [
                        "Michael Silva",
                        "Marketing Designer",
                        "London",
                        "1581",
                        "2012/11/27",
                        "$198,500"
                      ],
                      [
                        "Paul Byrd",
                        "Chief Financial Officer (CFO)",
                        "New York",
                        "3059",
                        "2010/06/09",
                        "$725,000"
                      ],
                      [
                        "Gloria Little",
                        "Systems Administrator",
                        "New York",
                        "1721",
                        "2009/04/10",
                        "$237,500"
                      ],
                      [
                        "Bradley Greer",
                        "Software Engineer",
                        "London",
                        "2558",
                        "2012/10/13",
                        "$132,000"
                      ],
                      [
                        "Dai Rios",
                        "Personnel Lead",
                        "Edinburgh",
                        "2290",
                        "2012/09/26",
                        "$217,500"
                      ],
                      [
                        "Jenette Caldwell",
                        "Development Lead",
                        "New York",
                        "1937",
                        "2011/09/03",
                        "$345,000"
                      ],
                      [
                        "Yuri Berry",
                        "Chief Marketing Officer (CMO)",
                        "New York",
                        "6154",
                        "2009/06/25",
                        "$675,000"
                      ],
                      [
                        "Caesar Vance",
                        "Pre-Sales Support",
                        "New York",
                        "8330",
                        "2011/12/12",
                        "$106,450"
                      ],
                      [
                        "Doris Wilder",
                        "Sales Assistant",
                        "Sydney",
                        "3023",
                        "2010/09/20",
                        "$85,600"
                      ],
                      [
                        "Angelica Ramos",
                        "Chief Executive Officer (CEO)",
                        "London",
                        "5797",
                        "2009/10/09",
                        "$1,200,000"
                      ],
                      [
                        "Gavin Joyce",
                        "Developer",
                        "Edinburgh",
                        "8822",
                        "2010/12/22",
                        "$92,575"
                      ],
                      [
                        "Jennifer Chang",
                        "Regional Director",
                        "Singapore",
                        "9239",
                        "2010/11/14",
                        "$357,650"
                      ],
                      [
                        "Brenden Wagner",
                        "Software Engineer",
                        "San Francisco",
                        "1314",
                        "2011/06/07",
                        "$206,850"
                      ],
                      [
                        "Fiona Green",
                        "Chief Operating Officer (COO)",
                        "San Francisco",
                        "2947",
                        "2010/03/11",
                        "$850,000"
                      ],
                      [
                        "Shou Itou",
                        "Regional Marketing",
                        "Tokyo",
                        "8899",
                        "2011/08/14",
                        "$163,000"
                      ],
                      [
                        "Michelle House",
                        "Integration Specialist",
                        "Sydney",
                        "2769",
                        "2011/06/02",
                        "$95,400"
                      ],
                      [
                        "Suki Burks",
                        "Developer",
                        "London",
                        "6832",
                        "2009/10/22",
                        "$114,500"
                      ],
                      [
                        "Prescott Bartlett",
                        "Technical Author",
                        "London",
                        "3606",
                        "2011/05/07",
                        "$145,000"
                      ],
                      [
                        "Gavin Cortez",
                        "Team Leader",
                        "San Francisco",
                        "2860",
                        "2008/10/26",
                        "$235,500"
                      ],
                      [
                        "Martena Mccray",
                        "Post-Sales support",
                        "Edinburgh",
                        "8240",
                        "2011/03/09",
                        "$324,050"
                      ],
                      [
                        "Unity Butler",
                        "Marketing Designer",
                        "San Francisco",
                        "5384",
                        "2009/12/09",
                        "$85,675"
                      ],
                      [
                        "Howard Hatfield",
                        "Office Manager",
                        "San Francisco",
                        "7031",
                        "2008/12/16",
                        "$164,500"
                      ],
                      [
                        "Hope Fuentes",
                        "Secretary",
                        "San Francisco",
                        "6318",
                        "2010/02/12",
                        "$109,850"
                      ],
                      [
                        "Vivian Harrell",
                        "Financial Controller",
                        "San Francisco",
                        "9422",
                        "2009/02/14",
                        "$452,500"
                      ],
                      [
                        "Timothy Mooney",
                        "Office Manager",
                        "London",
                        "7580",
                        "2008/12/11",
                        "$136,200"
                      ],
                      [
                        "Jackson Bradshaw",
                        "Director",
                        "New York",
                        "1042",
                        "2008/09/26",
                        "$645,750"
                      ],
                      [
                        "Olivia Liang",
                        "Support Engineer",
                        "Singapore",
                        "2120",
                        "2011/02/03",
                        "$234,500"
                      ],
                      [
                        "Bruno Nash",
                        "Software Engineer",
                        "London",
                        "6222",
                        "2011/05/03",
                        "$163,500"
                      ],
                      [
                        "Sakura Yamamoto",
                        "Support Engineer",
                        "Tokyo",
                        "9383",
                        "2009/08/19",
                        "$139,575"
                      ],
                      [
                        "Thor Walton",
                        "Developer",
                        "New York",
                        "8327",
                        "2013/08/11",
                        "$98,540"
                      ],
                      [
                        "Finn Camacho",
                        "Support Engineer",
                        "San Francisco",
                        "2927",
                        "2009/07/07",
                        "$87,500"
                      ],
                      [
                        "Serge Baldwin",
                        "Data Coordinator",
                        "Singapore",
                        "8352",
                        "2012/04/09",
                        "$138,575"
                      ],
                      [
                        "Zenaida Frank",
                        "Software Engineer",
                        "New York",
                        "7439",
                        "2010/01/04",
                        "$125,250"
                      ],
                      [
                        "Zorita Serrano",
                        "Software Engineer",
                        "San Francisco",
                        "4389",
                        "2012/06/01",
                        "$115,000"
                      ],
                      [
                        "Jennifer Acosta",
                        "Junior Javascript Developer",
                        "Edinburgh",
                        "3431",
                        "2013/02/01",
                        "$75,650"
                      ],
                      [
                        "Cara Stevens",
                        "Sales Assistant",
                        "New York",
                        "3990",
                        "2011/12/06",
                        "$145,600"
                      ],
                      [
                        "Hermione Butler",
                        "Regional Director",
                        "London",
                        "1016",
                        "2011/03/21",
                        "$356,250"
                      ],
                      [
                        "Lael Greer",
                        "Systems Administrator",
                        "London",
                        "6733",
                        "2009/02/27",
                        "$103,500"
                      ],
                      [
                        "Jonas Alexander",
                        "Developer",
                        "San Francisco",
                        "8196",
                        "2010/07/14",
                        "$86,500"
                      ],
                      [
                        "Shad Decker",
                        "Regional Director",
                        "Edinburgh",
                        "6373",
                        "2008/11/13",
                        "$183,000"
                      ],
                      [
                        "Michael Bruce",
                        "Javascript Developer",
                        "Singapore",
                        "5384",
                        "2011/06/27",
                        "$183,000"
                      ],
                      [
                        "Donna Snider",
                        "Customer Support",
                        "New York",
                        "4226",
                        "2011/01/25",
                        "$112,000"
                      ]
                    ]
                  };
                res.json(datos);
            }
        }
    );
});

router.post('/get_devices', async (req, res) => {
  const { id } = req.body; 
  pool.query(
      {
          sql: "SELECT * FROM devices WHERE id_owner=?",
          timeout: 30000,
      },
      [id],
      (error, results, fields) => {
          if(error) {
              res.json({status: false, msg: "petición hacia la base de datos erronea."});
          }
          else {
              res.json(results);
          }
      }
  );
});

router.post('/send_command', async (req, res)=>{

    const { commandMessage, deviceId } = req.body;
    console.log(req.body);
    const cloudRegion = 'us-central1';
    const projectId = 'lukas-lok';
    const registryId = 'factorb-iot';

    const iotClient = new iot.v1.DeviceManagerClient({
      // optional auth parameters.
    });

    const formattedName = iotClient.devicePath(
        projectId,
        cloudRegion,
        registryId,
        deviceId
    );

    const binaryData = Buffer.from(commandMessage);
    
    const request = {
        name: formattedName,
        binaryData: binaryData,
    };

    try {
        
        const responses = await iotClient.sendCommandToDevice(request);

        console.log('Sent command: ', responses[0]);
        res.json(responses[0]);
    } catch (err) {

        console.error('Could not send command:', err);
        res.json(err);
    }
});

router.post('/gps_send', (req, res) => {
  res.json({msg:"ok"});
  //res.status(401);
  /*const {latitude, longitude, speed, grade, time} = req.body;

  pool.query(
    {
        sql: 'INSERT INTO gps SET latitude=?, longitude=?, speed=?, grade=?, time=?',
        timeout: 30000, 
    },
    [latitude, longitude, speed, grade, time],
    (error, results, fields) => {

        if(error) {
          res.json({msg: "error insertando datos", status: false});
        }
        else {
          res.json({msg: "datos correctos", status: true});  
        }
    }
  );*/
});
router.post('/gps_multiple_send', (req, res) => {
    //console.log(req.body);
    res.json({msg:"ok"});
    //res.status(401);
    /*let data_nodemcu = req.body.data;
    let data = [];
    for(let i = 0 ; i < data_nodemcu.length-1 ; i ++){
      data.push([
        data_nodemcu[i].latitude, 
        data_nodemcu[i].longitude,
        data_nodemcu[i].speed, 
        data_nodemcu[i].grade,
        data_nodemcu[i].time
      ]);
      }

    console.log(data);
    
    pool.query(
      {
          sql: 'INSERT INTO gps (latitude, longitude, speed, grade, time) VALUES ?',
          timeout: 30000, 
      },
      [data],
      (error, results, fields) => {
  
          if(error) {
            res.json({msg: "error insertando datos", status: false});
          }
          else {
            res.json({msg: "datos correctos", status: true});  
          }
      }
    );*/
});
router.post('/send_file', upload.single('archivo'), (req, res) => {
  console.log(req.file);
  res.send("archivo recibido");
});
module.exports = router;