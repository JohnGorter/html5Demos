
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
  if (req.url != "") {
    console.log('reading file: ./App' + req.url);
    fs.readFile('./App' + req.url, 'utf8', function (err, data) {
      if (err) throw err;
      
      console.log(data);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  } else
  {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello John\n');
  }
});

server.listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');