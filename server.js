// Express server
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	path = require('path'),
	io = require('socket.io').listen(server);

server.listen(3000);
console.log("Express server listening on port 3000");

// Allow access to /public folder
app.configure(function () {
    app.use(express.static(path.join(__dirname,'/public'), {maxAge: 0}));
});

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'ChatServer -> Welcome' });
    socket.on('send', function (data) {
    	console.log("ChatServer -> Received");
        io.sockets.emit('message', data);
    });
});