var express = require('express');
var router = express.Router();

var validator = require('validator');

const iot = require('@google-cloud/iot');
const passport = require('passport');
const { verify } = require('../lib/verify_user');

const bcrypt = require('bcrypt');
const { suppressDeprecationWarnings } = require('moment');

const saltRounds = 10;
const path = require("path");
const fs = require("fs");

const multer = require('multer');
const machines = require('../config/mongoose/maquinas');
const devices = require('../config/mongoose/device');
const users = require('../config/mongoose/users');
const https = require('https');


const machineController = require('../controllers/machines');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/machines/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })


// API MAQUINAS
router.post('/deleteMachine', machineController.deleteMachine);
router.post('/editMachine', machineController.editMachine);

/*async function send_repeat_multiple(datos_f) {
  
  for(let i = 0 ; i < datos_f.length ; i ++){
    send_repeat(datos_f[i]);
  }
}
async function send_repeat(datos_f) {
  const data = JSON.stringify(datos_f);
  
  const options = {
    hostname: 'traklok.kausana.cl',
    port: 443,
    method: 'POST',
    path: '/api/restapp/trip_data/',
    headers: {
      'Content-Type': 'application/json',
      'Username': "gpsplq1",
      'Password': "p4ss.gps1"
    }
  }
  
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      process.stdout.write(d)
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })
  
  req.write(data)
  req.end()
}*/



router.post('/send_command', async (req, res)=>{

    const { commandMessage, deviceId } = req.body;
    console.log(req.body);
    const cloudRegion = 'us-central1';
    const projectId = 'desarrollofactorb';
    const registryId = 'factorb';

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




//PROYECTO USANDO MONGO

router.post('/find_machines', async (req, res) =>{
  const { id } = req.body;
  //await machines.find({usuarios_permitidos: id}, function(err, response) {
    await machines.find(function(err, response) {
    if(err){
        res.status(400).json({msg: "error en la peticion", status: false});
    }
    else {
        if(response == null){
            res.json({ msg: "no hay maquinas asociadas", status: false });
        }
        else {
            res.json({data: response, status: true});
        } 
    }
  });
});

router.post('/find_OneMachine', async (req, res) =>{
  const { id_machine } = req.body;
  await machines.find({_id: id_machine}, function(err, response) {
    if(err){
        res.status(400).json({msg: "error en la peticion", status: false});
    }
    else {
        if(response == null){
            res.json({ msg: "no hay maquinas asociadas", status: false });
        }
        else {
            res.json({data: response, status: true});
        } 
    }
  });
});

router.post('/find_OneDevice', async (req, res) =>{

    const { id_machine, id_device } = req.body;
  
    await machines.find(
    {
        _id: id_machine, 
        'dispositivos.id_device': id_device
    }, 
    "dispositivos", 
    function(err, response) {
        if(err){
            
            res.json({ msg: "Error, no se pudo completar la solicitud", status: false });
        }
    else {
        if(response == null){
            res.json({ msg: "no hay maquinas asociadas", status: false });
        }
        else {
            console.log(response);
            res.json({data: response, status: true});
        } 
    }
  });
});

router.post('/find_variables', async (req, res) =>{

  const { idMachine, idDevice } = req.body;

  await machines.find(
  {
      _id: idMachine, 
      'dispositivos.id_device': idDevice
  }, 
  "dispositivos.sensores dispositivos.id_device dispositivos._id", 
  function(err, response) {
      if(err){
          
          res.json({ msg: "Error, no se pudo completar la solicitud", status: false });
      }
  else {
      if(response == null){
          res.json({ msg: "no hay maquinas asociadas", status: false });
      }
      else {
          console.log(response);
          res.json({data: response, status: true});
      } 
  }
});
});

router.post('/find_datavariable', async (req, res) =>{
  const { inicio, fin } = req.body;
  await machines.find(
  {
    //'dispositivos.id_device': "60c0dd965ac07d4e743376f0",
     'dispositivos.data.created_at_origin': {
        $gte: new Date(inicio),
        $lt: new Date(fin)
    }
  },
  function(err, response) {
      if(err){
          
          res.json({ msg: "Error, no se pudo completar la solicitud", status: false });
      }
  else {
      if(response == null){
          res.json({ msg: "no hay maquinas asociadas", status: false });
      }
      else {
          console.log(response);
          res.json({data: response, status: true});
      } 
  }
});
});

router.post('/find_machinestracker', async (req, res) =>{

    const { id, id_machine } = req.body;

    await machines.where({usuarios_permitidos: id, tracker: true, _id: id_machine}).find( async function(err, response) {
        if(err){
            res.status(400).json({msg: "error en la peticion", status: false});
        }
        else {
            if(response == null){
                res.json({ msg: "no hay maquinas asociadas", status: false });
            }
            else {
              
                let id_device2 = "";
                for(let i = 0 ; i < response[0].dispositivos.length ; i ++ ){
                    if(response[0].dispositivos[i].gps){
                        //console.log(response[0].dispositivos[i].id_device);
                        id_device2 = response[0].dispositivos[i].id_device;
                        //console.log(id_device);
                    }
                }

                console.log(id_device2);
                await devices.where({_id: id_device2}).find( function(err, response2) {
                  
                    res.json({data: response2, data2: response, status: true});
                });
                
            } 
        }
    });
});

router.post('/gps_multiple_send', (req, res) => {
  
  try {
    console.log("data", req.body);
    let data_nodemcu = req.body.data;
    let name_device = req.body.name_device;
    let data = [];
    let datos_f = [];
    for(let i = 0 ; i < data_nodemcu.length-1 ; i ++){
      data.push({
          lat: data_nodemcu[i].latitude,
          lng: data_nodemcu[i].longitude,
          bat: data_nodemcu[i].battery,
          wifi: data_nodemcu[i].wifi,
          grade: data_nodemcu[i].grade,
          speed: data_nodemcu[i].speed,
          status_gps: data_nodemcu[i].status_gps,
          time: data_nodemcu[i].time 
      });

      datos_f.push({
          longitud: data_nodemcu[i].longitude,
          latitud: data_nodemcu[i].latitude,
          fecha: data_nodemcu[i].time,
          direccion: data_nodemcu[i].grade,
          ignicion: 0, 
          velocidad: data_nodemcu[i].speed,
          patente: "KAU123"
      });
    }
    send_repeat_multiple(datos_f);
    devices.updateMany(
      {name: name_device },
      {$push: {'data': data}},
      (err, response3) => {
        if(err) {
          res.status(404).json({msg: "error db"})
        }
        else {
          console.log(response3);
          
          res.json({msg: "ok", data: response3});
          
        }
      }
    );
  }
  catch(err){
    res.status(401).json({msg: "error "});
  }
});

router.post('/gps_send2', async (req, res) => {  
  console.log(req.body);
  res.json({msg: 'wena qlo!'})
  }
);
router.post('/gps_send', async (req, res) => {
  const {latitude, name_device, longitude, battery, speed, grade, wifi, status_gps, time} = req.body;
  const data_gps = {
    lat: latitude,
    lng: longitude,
    speed: speed,
    bat: battery,
    wifi: wifi,
    grade: grade,
    status_gps: status_gps,
    time: time
  };
  
  devices.updateOne(
    {name: name_device },
    {$push: {'data': data_gps}},
    (err, response3) => {
      if(err) {
        console.log(err);
      }
      else {
        console.log(response3);
        let datos_fu = {
          longitud: longitude,
          latitud: latitude,
          fecha: time,
          direccion: grade,
          ignicion: 0, 
          velocidad: speed,
          patente: "KAU123"
        }
        //send_repeat(datos_fu);
        res.json({msg: "ok", data: response3});
      }
    }
  );


  // create a comment
//parent.children.push({ name: 'Liesl' });
//const subdoc = parent.children[0];
//console.log(subdoc) // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
//subdoc.isNew; // true
/*
parent.save(function (err) {
  if (err) return handleError(err)
  console.log('Success!');
});
  
  await devices.updateOne({name: name_device}, { $push: {data: data_gps} }, 
  });*/

  
});

router.post('/find_datadevicetracker', async (req, res) =>{

  const { name } = req.body;

  
  await 
  devices
  .find( 
    { 
      name: name
    },{
      data: { $slice: -8000 }
    }
  ).sort(
    {
      time: 1
    }
  ).exec(async function(err, response) {
    if(err){
        res.status(400).json({msg: "error en la peticion", status: false});
    }
    else {
        if(response == null){
            res.json({ msg: "no hay maquinas asociadas", status: false });
        }
        else {
            res.json({data: response, status: true});
        } 
    }});

});


router.post('/administracion', async (req, res) => {
  let rawdata = fs.readFileSync('./public/json/administracion.json');
  let student = JSON.parse(rawdata);
  res.json(student);
});

router.post('/createMachine', async (req, res) => {


  var fecha = (new Date).getTime();
  console.log(req.body);
  let params = {
    nombre: req.body.nameMachine,
    descripcion: req.body.descriptionMachine,
    ubicacion: req.body.location,
    creado: fecha,
    usuarios_permitidos: req.body.usuarios_permitidos
  }
  let machine = new machines(params);
  machine.save().then(savedDoc => {
    console.log(savedDoc);
    res.json({create: true, msg: savedDoc.nombre + ", ha sido creada exitosamente", id: savedDoc._id});
  });
    /*var params = {
        nodename: req.body.nodename,
        marca: req.body.marca,
        modelo: req.body.modelo,
        patente: req.body.patente,
        fcreate: fecha
    };*/
    //const Node = new node(params);
   // await Node.save();
  

});



router.post('/createUser', async (req, res) => {
    //validar datos
    const {name, lastnames, email, password, rol} = req.body;
    
    console.log(req.body);
    let creacion = (new Date).getTime();
    console.log(req.body);
    let params = {
        nombre: name,
        apellidos: lastnames,
        email: email,
        pwd: password,
        rol: rol,
        creado: creacion
    }
    let user = new users(params);
    user.save().then(savedDoc => {
        console.log(savedDoc);
        res.json({create: true, msg: savedDoc.nombre + ", ha sido creada exitosamente", id: savedDoc._id});
    });
});

router.post('/showUsers', async (req, res) => {
  await users.find(function(err, response) {
    if(err){
        res.status(400).json({msg: "error en la peticion", status: false});
    }
    else {
        if(response == null){
            res.json({ msg: "no hay maquinas asociadas", status: false });
        }
        else {
            res.json({data: response, status: true});
        } 
    }
  });
});


router.post('/uploadfile/:idMachine', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  console.log(file);

  machines.updateOne(
    {_id: req.params.idMachine },
    {url: file.originalname},
    (err, response3) => {
      if(err) {
        console.log(err);
      }
      else {
        console.log(response3);
        if (!file) {
          console.log("failed");
          const error = new Error('Please upload a file')
          error.httpStatusCode = 400
          return next(error)
        }
        console.log("ok");
        
        res.redirect('/dashboard/maquinas');

      }
    }
  );
});


router.post('/createDevice', async (req, res) => {
    const { idMachine, nameDevice, idDevice, descriptionDevice } = req.body;

    
    let device = new devices({name: nameDevice, data: []});
    
    device.save().then( savedDoc1 => {
      machines.updateOne(
        {_id: idMachine },
        {
          $push: {
            'dispositivos': {
              id_device: savedDoc1._id,
              name: nameDevice
            }
          }
        }).then( savedDoc => {
          console.log(savedDoc);
          res.json({create: true, msg: savedDoc1.name + ", ha sido creada exitosamente", id: savedDoc1._id});
        });
  });
});

router.post('/createSensor', async (req, res) => {
    const {idMachine, nameSensor, idSensor, idDevice, typeDevice, color, typeVariable, data} = req.body;
    let subdata = {};

    //, typeDevice, data, color 
    console.log(req.body);

    //variables
    if(typeDevice == 0) {
      
        //analoga
        if(data.typeVariable == 1) {

          const { measurementSensor, variable, minSensor, maxSensor, setpoint } = data;
          subdata = {
            type: "AI",
            name: nameSensor,
            id_variable: idSensor,
            measurement: measurementSensor,
            variable: nameSensor,
            minSensor,
            maxSensor,
            color: color,
            controlable: setpoint
          };
          //const { measurementSensor, minSensor, maxSensor, setpoint } = data;

        }

        //entrada digital
        else if(data.typeVariable == 2) {
          subdata = {
            type: "DI"
          };
        } 
        
        //salida digital
        else if(data.typeVariable == 3) {
          subdata = {
            type: "DO", 
            name: nameSensor,
            descripcion: "descripcion",
            variable: idSensor
          };
        }



        machines.findOneAndUpdate({ 
            _id:idMachine, 
            "dispositivos.id_device":idDevice
        },{     
            $push: {
              "dispositivos.$.sensores": subdata
            }
        }).then((result) => {
            
            console.log(result);
            res.json({aaa: "adasdasd"});
        }); 
    }
              /*  machines.updateOne(
            {_id:idMachine, dispositivos: {id_device: idDevice} },
            {url: file.originalname},
            (err, response3) => {
              if(err) {
                console.log(err);
              }
              else {
                console.log(response3);
                if (!file) {
                  console.log("failed");
                  const error = new Error('Please upload a file')
                  error.httpStatusCode = 400
                  return next(error)
                }
                console.log("ok");
                
                res.redirect('/dashboard/maquinas');
        
              }
            }
          );*/

          /*Folder.findOneAndUpdate(
    { "_id": folderId, "permissions._id": permission._id },
    { 
        "$set": {
            "permissions.$.role": permission.role
        }
    },
    function(err,doc) {

    }
); */

       // }
        
        //entrada digital
     //   else if(data.typeVariable == 2) {

     //   } 
        
        //salida digital
      //  else if(data.typeVariable == 3) {

     //   }
   // } 
    //gps
   // else if(typeDevice == 1) {

   // } 
    //video en vivo
   // else if(typeDevice == 2) {
      
   // } 
    //rfid
   // else if(typeDevice == 3) {
      
   // }
 //res.json({msg:"ok"});
});
module.exports = router;