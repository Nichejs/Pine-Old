// Express server
var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	path = require('path'),
	io = require('socket.io').listen(server),
	nano = require('nano')('http://pi:pi@localhost:8000'),
	crypto = require('crypto');


server.listen(3000);
console.log("Express server listening on port 3000");

// Allow access to /public folder
app.configure(function () {
	app.use(express.bodyParser());
	app.use(app.router);
    app.use(express.static(path.join(__dirname,'/public'), {maxAge: 0}));
});

// CouchDB Access
app.post('/api/db', function (req, res) {
	// Nano!
	var nano = require('nano')('http://pi:pi@localhost:8000');
    if(req.body == undefined){
    	req.body = {user : {type : 'Unsupported'}};
    }
    
    console.log("POST to /api/db: ", req.body.type);
    
    //TODO Improve this section
    switch(req.body.type){
    	case 'login':
    		// Check if user exists
    		var users = nano.use('users');
    		// Sha1 password
    		var sha1 = crypto.createHash('sha1');
    		sha1.update(req.body.pass);
    		
    		users.view('users','name-pass', {key: [req.body.user, sha1.digest('hex')]}, function (error, view) {
    			if(error !== null){
    				console.log(error);
    				res.send("An error occured");
    				res.end();
    			}else{
    				console.log("Login ok");
	    			res.send(view);
	    			res.end();	
    			}
    		});
    		break;
    	case 'register':
    		var data = req.body.user,
    			users = nano.use('users');
    		// Sha1 of password
    		var sha1 = crypto.createHash('sha1');
		    sha1.update(data.pass);
		    // Insert in database
		    //users.insert(data.name, {name: data.name, pass: sha1.digest('hex')});
		    console.log("Intentando insertar");
		    users.insert({name: data.name, pass: sha1.digest('hex')}, function(err, body) {
				if (err){
					res.send("No se pudo completar el registro");
					console.err(err);
				}
				console.log('done');
				res.send("Usuario registrado, bienvenido "+data.name+"!");
				res.end();
			});
		    
    		break;
		default:
			res.send(JSON.stringify('Unsupported'));
			res.end();
    }
});

// GET handle for the API
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

// SocketIO
io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'ChatServer -> Welcome' });
    socket.on('send', function (data) {
    	console.log("ChatServer -> Received");
        io.sockets.emit('message', data);
    });
});