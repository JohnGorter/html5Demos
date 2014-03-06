var http = require('http');
var fs = require('fs');
var less = require('less');
var mongoose = require('mongoose');

console.log("connecting to database"); 
mongoose.connect('mongodb://localhost/john');
var TodoModel = mongoose.model('Todo', { title: String, description: String });



http.createServer(function (req, res) {
    // Get the URL
    var url = req.url;
    
    // Automatically serve index.html if needed
    if (stringEndsWith(url, '/')) {
        url += 'index.html';
    }
    
    if (url.indexOf('todojson') > 0) {
        console.log("getting todos");
        TodoModel.find(function(err, data) {
            console.log("sending todos");
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(data));
            res.end();
        });
        return ;
    }
    
    
    // Make sure we get it from the source directory
    url = './app' + url;
    
    // Get the document
    fs.exists(url, function (exists) {
        if (exists) {
            // Serve the right type of document
            if (stringEndsWith(url, '.html')) {
                fs.readFile(url, {encoding: 'utf-8'}, function (err, data) {
                    if (err) {
                        console.log('Failure to load: ' + url);
                        displayInternalError();
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(data);
                        res.end();
                    }
                });
            } else if (stringEndsWith(url, '.jpg')) {
                fs.readFile(url, function (err, data) {
                    if (err) {
                        console.log('Failure to load: ' + url);
                        displayInternalError();
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/jpeg'});
                        res.write(data);
                        res.end();
                    }
                });
            } else if (stringEndsWith(url, '.css')) {
                fs.readFile(url, {encoding: 'utf-8'}, function (err, data) {
                    if (err) {
                        console.log('Failure to load: ' + url);
                        displayInternalError();
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/css'});
                        res.write(data);
                        res.end();
                    }
                });
            } else if (stringEndsWith(url, '.less')) {
                fs.readFile(url, { encoding: 'utf-8' }, function (err, data) {
                    if (err) {
                        console.log('Failure to load: ' + url);
                        displayInternalError();
                    } else {
                        less.render(data, function (lesserr, css) {
                            if (lesserr) {
                                console.log('Failure to parse less file: ' + url);
                                displayInternalError();
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/css' });
                                res.write(css);
                                res.end();
                            }
                        });

                    }
                });
            } else if (stringEndsWith(url, '.js')) {
                fs.readFile(url, {encoding: 'utf-8'}, function (err, data) {
                    if (err) {
                        console.log('Failure to load: ' + url);
                        displayInternalError();
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/javascript'});
                        res.write(data);
                        res.end();
                    }
                });
            }else {
                console.log('Request for unsupported file: ' + url);
                displayNotFound();
            }
        } else {
            console.log('Request for non-existing file: ' + url);
            displayNotFound();
        }
    });
    
    function displayInternalError() {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('Internal server error, sorry. Status code 500.');
        res.end();
    }
    
    function displayNotFound() {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('The page you requested could not be found. Status code 404.');
        res.end();
    }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

function stringEndsWith(str, ending) {
    return str.indexOf(ending, str.length - ending.length) !== -1;
}