// Express server
var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	path = require('path'),
	io = require('socket.io').listen(server),
	nano = require('nano')('http://pi:pi@localhost:8000'),
	crypto = require('crypto'),
	sha1 = crypto.createHash('sha1');


server.listen(3000);
console.log("Express server listening on port 3000");

// Allow access to /public folder
app.configure(function () {
	app.use(express.bodyParser());
	app.use(app.router);
    app.use(express.static(path.join(__dirname,'/public'), {maxAge: 0}));
});

// CouchDB Access
app.get('/api/db', function (req, res) {
	
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

// Requests
app.post('/api/post', function(request, response){
    
    var data = request.body.user;
    
    console.log("Received data: ", data);
    
    var users = nano.use('users');
    // Sha1 of password
    sha1.update(data.pass);
    // Insert in database
    //users.insert(data.name, {name: data.name, pass: sha1.digest('hex')});
    console.log("Intentando insertar");
    users.insert({name: data.name, pass: sha1.digest('hex')}, function(err, body) {
		if (err) console.err(err);
		console.log('done');
	});
    
    response.send("Recibido!");
    response.end();

});

// SocketIO
io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'ChatServer -> Welcome' });
    socket.on('send', function (data) {
    	console.log("ChatServer -> Received");
        io.sockets.emit('message', data);
    });
});