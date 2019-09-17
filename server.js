// built-in Node.js modules
var fs = require('fs');
var http = require('http');
var path = require('path');

var port = 8000;
var public_dir = path.join(__dirname, 'public');

function NewRequest(req, res) {
    var filename = req.url.substring(1);
    if (filename === '') {
        filename = 'index.html';
    }

    if (req.method === 'GET'){

        var fullpath = path.join(public_dir, filename);
        fs.readFile(fullpath, (err, data) => {
        if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('Oh no! Could not find file');
                res.end();
        }
        else {
                if (path.extname(filename) === '.html'){
                    res.writeHead(200, {'Content-Type': 'text/html'});
                }else if (path.extname(filename) === '.jpg'){
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                }else if (path.extname(filename) === '.png'){
                    res.writeHead(200, {'Content-Type': 'image/png'});
                }else if (path.extname(filename) === '.js') {
                    res.writeHead(200, {'Content-Type': 'text/javascript'});
                }else if (path.extname(filename) === '.css'){
                    res.writeHead(200, {'Content-Type': 'text/css'});
                }else if(path.extname(filename) === '.json'){
                    res.writeHead(200, {'Content-Type': 'application/json'});
                }else {
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                }
                res.write(data);
                res.end();
        }
        });
    }else if (req.method === 'POST'){
        
    }
}

var server = http.createServer(NewRequest);

console.log('Now listening on port ' + port);
server.listen(port, '0.0.0.0');
