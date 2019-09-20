// built-in Node.js modules
var fs = require('fs');
var http = require('http');
var path = require('path');

var port = 8000;
var public_dir = path.join(__dirname, 'public');

//global variable of memebers to prevent race condition
var members = {};
fs.readFile('public/data/members.json', (err, data) => {
    if (err) throw err;
    members = JSON.parse(data);
});

function NewRequest(req, res) {

    var filename = req.url.substring(1);
    if (filename === '') {
        filename = 'index.html';
    }

    var dict = new Map();
    dict.set('.html', 'text/html');
    dict.set('.jpg', 'image/jpeg');
    dict.set('.png', 'image/png');
    dict.set('.js', 'text/javascript');
    dict.set('.css', 'text/css');
    dict.set('.json', 'application/json');

    if (req.method === 'GET'){
        //console.log(req.headers);
        var fullpath = path.join(public_dir, filename);
        fs.readFile(fullpath, (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('Oh no! Could not find file');
                res.end();
            }
            else {
                res.writeHead(200, {'Content-Type' : dict.get(path.extname(filename))});
                res.write(data);
                res.end();
            }
        });
    }else if (req.method === 'POST'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            body = decodeURIComponent(body);
            let params = body.split('&');
            let email = '';
            const keyValPairs = {};

            params.forEach(param => {
                const [key, value] = param.split('=');
                if (key === 'email') {
                    email = value;
                } else {
                    keyValPairs[key] = value;
                }
            });

            const output = {};
            output[email] = keyValPairs;
            const ret = {};

            for (var key in members) {
                ret[key] = members[key];
            }
            for (var key in output){
                ret[key] = output[key];
            }

            members = ret;
            var json = JSON.stringify(ret);
            fs.writeFile('public/data/members.json', json, function(err){

            });

            filename = 'join.html'
            var fullpath = path.join(public_dir, filename);
            fs.readFile(fullpath, (err, data) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.write('Oh no! Could not find file');
                    res.end();
                }
                else {
                    res.writeHead(200, {'Content-Type' : dict.get(path.extname(filename))});
                    res.write(data);
                    res.end();
                }
            });
        });
    }
}

var server = http.createServer(NewRequest);

console.log('Now listening on port ' + port);
server.listen(port, '0.0.0.0');
