// Express server
var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	path = require('path'),
	io = require('socket.io').listen(server),
	nano = require('nano')('http://pi:pi@localhost:8000'),
	crypto = require('crypto'),
	connect = require('connect'),
	parseCookie = connect.utils.parseCookie,
	MemoryStore = connect.middleware.session.MemoryStore,
	store,
	users = 0;


server.listen(3000);
console.log("Express server listening on port 3000");

// Allow access to /public folder
app.configure(function () {
	app.use(express.cookieParser());
	app.use(express.session({
		key: 'OPENRPG_ID',
    	secret: 'ADRG$WHSRHRWUsdfj@~€7ghzdfhgksdjñ76857hkse',
    	store: store = new MemoryStore(),
	    cookie: {
			path: '/',
			domain: 'uplei.com',
			maxAge: 1000 * 60 * 24 // 24 hours
	    }
 	}));
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

// Client authorisation
io.set('authorization', function (data, accept) {
	console.log("Data: ",data.query);
	// Now use data.query to handle login
	// Check if user exists
	var users = nano.use('users');
	// Sha1 password
	var sha1 = crypto.createHash('sha1');
	sha1.update(data.query.pass);
	
	users.view('users','name-pass', {key: [data.query.user, sha1.digest('hex')]}, function (error, view) {
		if(error !== null){
			console.log(error);
			accept(null,false);
		}else{
			console.log(view);
			if(view.rows.length > 0){
				data.sessionID = view.rows[0].id;
				console.log("Login ok, user id = "+view.rows[0].id);
				accept(null, true);
			}else{
				accept(null,false);
			}
		}
	});
});

// Chat
io.sockets.on('connection', function (socket) {
	users++;
	console.log(users+' users online.');
	socket.on('chatEmit', function (data) {
		console.log("ChatServer -> Received");
		io.sockets.emit('chatMessage', data);
	});
}).on('disconnect', function(){
	users--;
})/*.on('subscribe', function(data){
	socket.join(data.room);
}).on('unsubscribe', function(data){
	socket.leave(data.room);
})*/;

// Socket intervals
var usersOnlineInterval = setInterval(function(){
	//io.sockets.broadcast.to('usersOnline').emit('function', {count:users});
	io.sockets.in('usersOnline').emit('message', {count:users});
},500);
