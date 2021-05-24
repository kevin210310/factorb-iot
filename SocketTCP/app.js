require('./config/mongoose/index');
let devices = require('./config/mongoose/device');
const { now } = require('moment');
var moment = require('moment');

const https = require('https');
async function send_repeat_multiple(datos_f) {
  
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
}

/* Or use this example tcp client written in node.js.  (Originated with 
example code from 
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

var net = require('net');
var textChunk = 'OK';
var server = net.createServer(function(socket, err) {
	socket.write('factorb server\r\n');
	socket.on('data', function(data, err){
		
        let data2 = Buffer.from(data, 'base64').toString('ascii')
		//console.log(data2);

		try {
          
            let obj = JSON.parse(data2);
            console.log(obj);
            //console.log(obj)

			const data_gps = {
				lat: obj.latitude,
				lng: obj.longitude,
				speed: obj.speed,
				bat: 4.23,
				wifi: -60,
				grade: 100,
				status_gps: 1,
				time: obj.time
			};

			let datos_fu = {
				longitud: obj.longitude,
				latitud: obj.latitude,
				fecha: obj.time,
				direccion: 0,
				ignicion: 0, 
				velocidad: obj.speed,
				patente: "KAU123"
			  }
			  //send_repeat(datos_fu);

			devices.updateOne(
				{name: obj.name_device },
				{$push: {'data': data_gps}},
				(err, response3) => {
				  if(err) {
					console.log(err);
				  }
				}
			  );
        }
        catch(error) {
          console.log("el paquete no es un json");
        }
		//var string = data2.split(",");
		
		/*if(string[0] == "+BUFF:GTFRI") {
			
			const data_gps = {
				lat: string[12],
				lng: string[11],
				speed: 50.0,
				bat: 4.23,
				wifi: -60,
				grade: 100,
				status_gps: 1,
				time: moment(Date.now()).utc().format("YYYY-MM-DD HH:mm:ss")
			  };
			
			  devices.updateOne(
				{imei: string[2] },
				{$push: {'data': data_gps}},
				(err, response3) => {
				  if(err) {
					console.log(err);
				  }
				}
			  );

		}*/
    	
		socket.write(textChunk);
	});
	socket.on('error', function(err) {
		console.log(err)
	})

	socket.on('close', function() {
		console.log('Connection closed');
	});
});
server.listen(51021, '0.0.0.0');