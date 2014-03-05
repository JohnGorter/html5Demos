
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {

  // Set default url in case none was provided
  var url = req.url;
  if (url == '/') {
    url += 'index.html';
  }
  
  // Make sure we only get files from the App directory
  url = './App' + url;
  
  fs.exists(url, function(exists) {
    if (exists) {
      // Serve up the file
      // TODO: serve not everything as HTML
      fs.readFile(url, 'utf8', function (err, data) {
        if (err) {
          console.log('Error reading file: ' + url);
          showInternalError();
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(data);
          res.end();
        }
      });
    } else {
      // File does not exist, return 404
      console.log('Request for non-existing file: ' + url);
      res.writeHead(404, {'Content-Type': 'text/plain'})
      res.write('404 not found. The page you requested does not exist.');
      res.end();
    }
  });
  
  function showInternalError() {
    res.writeHead(500, {'Content-Type': 'text/plain'})
    res.write('500 internal server error.');
    res.end();
  }

});

server.listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');