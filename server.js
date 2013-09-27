/*var http = require('http');

var index = fs.readFileSync('index.html');

http.createServer(function(req,resp) {
	resp.writeHead(200, {"Content-Type": "text/html"});
	
	resp.write(index);
	resp.end();
	
	console.log("sample output to console");

}).listen(8080);*/
var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
).listen(8080);