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
    	// I leave the login function here just in case
    	// but at the moment it's not necessary. Login is handled by the socket.
    	/*case 'login':
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
    		break;*/
    	case 'register':
    		var data = req.body.user,
    			users = nano.use('users');
    		// Sha1 of password
    		var sha1 = crypto.createHash('sha1');
		    sha1.update(data.pass);
		    // Insert in database
			users.insert({_id: data.name, pass: sha1.digest('hex')}, function(err, body) {
				if (err){
					if(err.status_code == 409){
						res.send("El usuario ya existe!!");
					}else{
						res.send("Ha ocurrido un error extraño con el servidor, intentalo mas tarde");
					}
					//res.end();
				}else{
					res.redirect('/');
				}
			});
		    
    		break;
		default:
			res.send(JSON.stringify('Unsupported'));
    }
});

// SocketIO

io.set('log level', 2); // 0 error, 1 warnings, 2 info, 3 for debug

// Client authorisation
io.set('authorization', function (data, accept) {
	// Now use data.query to handle login
	// Check if user exists
	var users = nano.use('users');
	// Sha1 password
	var sha1 = crypto.createHash('sha1');
	sha1.update(data.query.pass);
	
	users.view('lists','user-pass', {key: [data.query.user, sha1.digest('hex')]}, function (error, view) {
		if(error !== null){
			console.error(error);
			accept(null,false);
		}else{
			if(view.rows.length > 0){
				data.user = data.query.user;
				console.log("Login ok, User="+view.rows[0].id);
				accept(null, true);
			}else{
				accept(null,false);
			}
		}
	});
});

// ----------------------------------
// CHAT



io.sockets.on('connection', function(socket){
	
	users++;
	
	socket.on('subscribe', function(room) { 
	    socket.join(room);
	    if(room=='chat'){
	    	io.sockets.in(room).emit('message', {type: 'server', message : socket.handshake.user+" joined"});
	    }
	});
	
	socket.on('unsubscribe', function(room) {  
	    socket.leave(room);
	});
	
	socket.on('send', function(data) {
		if(data.room == 'chat'){
			// Chat message
			data.user = socket.handshake.user;
	    	io.sockets.in(data.room).emit('message', data);
		}else if(data.room == 'position'){
			// User position
			socket.broadcast.to('position').emit('update', { user: socket.handshake.user, position: data.position});
		}
		
	});
	
	socket.on('ping', function(data) {
	    socket.emit('ping', data);
	});
	
	socket.on('disconnect', function(){
		
		io.sockets.in('chat').emit('message', {type: 'server', message : socket.handshake.user+" left"});
		
		clearInterval(usersOnlineInterval);
		
		users--;
	});
	
	// Socket intervals
	var usersOnlineInterval = setInterval(function(){
		io.sockets.in('server').emit('usersOnline', {count:users});
	},1000);
	
});


