/*var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(8080);*/
var connect = require('connect')
  , http = require('http');

var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(connect.directory('public'))
  .use(connect.cookieParser())
  .use(connect.session({ secret: 'no se que es esto' }))
  .use(function(req, res){
    res.end('Servidor de Open RPG\n');
  });

http.createServer(app).listen(8080);