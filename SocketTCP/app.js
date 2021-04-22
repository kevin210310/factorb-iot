require('./config/mongoose/index');
var net = require('net');

var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');

/*
And connect with a tcp client from the command line using netcat, the *nix 
utility for reading and writing across tcp/udp network connections.  I've only 
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo server
*/

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
		if(string[0] == "+BUFF:GTFRI") {
			
			console.log("NOMBRE: ", string[2]);
			console.log("LAT: ", string[10]);
			console.log("LNG: ", string[9]);

		}
    	
		socket.write(textChunk);
	});
});
server.listen(51021, '0.0.0.0');