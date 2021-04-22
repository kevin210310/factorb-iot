require('./config/mongoose/index');
let devices = require('./config/mongoose/device');
const { now } = require('moment');
var moment = require('moment');
/* Or use this example tcp client written in node.js.  (Originated with 
example code from 
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

var net = require('net');
var textChunk = '';
var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.on('data', function(data){
		console.log(data);
        //let data2 = Buffer.from(data, 'base64').toString('ascii')
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
});
server.listen(51021, '0.0.0.0');