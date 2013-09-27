// Sirve los contenidos de la carpeta "public"
var connect = require('connect');
connect.createServer(
    connect.static(__dirname + '/public')
).listen(8080);
