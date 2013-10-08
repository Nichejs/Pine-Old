// Express server
var express = require('express'),
    http = require('http'),
    path = require('path'),
    ioServer = require('socket.io'),
    app = express();
// Allow access to /public folder
app.configure(function () {
    app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app).listen(3000, function () {
    console.log("Express server listening on port 3000");
});
