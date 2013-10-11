// Express server
var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	path = require('path'),
	io = require('socket.io').listen(server);


server.listen(3000);
console.log("Express server listening on port 3000");

// Allow access to /public folder
app.configure(function () {
	app.use(app.router);
    app.use(express.static(path.join(__dirname,'/public'), {maxAge: 0}));
});

// CouchDB Access
app.get('/api/db', function (req, res) {
	// Nano!
    var nano = require('nano')('http://pi:pi@localhost:8000');
    
    // Users handle
    var users = nano.use('users');
    var response = '';
    users.view('userList', 'userList', function(err, body) {
	  if (!err) {
	    body.rows.forEach(function(doc) {
	      response += "\n"+doc.value;
	      console.log(doc.value);
	    });
	    res.send(response);
		console.log("Response: ",response);
		res.end();
	  }
	});
});


// SocketIO
io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'ChatServer -> Welcome' });
    socket.on('send', function (data) {
    	console.log("ChatServer -> Received");
        io.sockets.emit('message', data);
    });
});