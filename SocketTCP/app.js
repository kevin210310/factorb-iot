require('./config/mongoose/index');

/* Or use this example tcp client written in node.js.  (Originated with 
example code from 
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

var net = require('net');
var textChunk = '';
var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.on('data', function(data){
        let data2 = Buffer.from(data, 'base64').toString('ascii');
		console.log(data2);
		var string = data2.split(",");
    	console.log(string);
		//textChunk = data.toString('base64');
		//console.log(textChunk);
		socket.write(textChunk);
	});
});
server.listen(51021, '0.0.0.0');