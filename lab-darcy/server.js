"use strict";

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const cowsay = require('cowsay');
const fs = require('fs');
const parseBody = require(`./lib/parse-body.js`);
const PORT = process.env.PORT || 3000;

// let home = `<!DOCTYPE html>
// <html>
//   <head>
//     <title> cowsay </title>  
//   </head>
//   <body>
//    <header>
//      <nav>
//        <ul> 
//          <li><a href="/cowsay">cowsay</a></li>
//        </ul>
//      </nav>
//    <header>
//    <main>
//      <!-- project description -->
//    </main>
//   </body>
// </html>`;

const server = http.createServer(function (req, res) {
    req.url = url.parse(req.url);
    req.url.query = querystring.parse(req.url.query);

    if (req.method === 'GET' && req.url.pathname === '/') {
        handleGet(res);
    };

    if (req.method === 'GET' && req.url.pathname === '/cowsay/') {
        handleCowsayGet(res);
    };

    if (req.method === 'POST' && req.url.pathname === '/api/cowsay/') {
        handleCowsayPost(req);
    };

    res.end();
});


function handleGet() {
    fs.readFile('index.html', (err, data) => {
        if (err) {
            res.writeHead(404, 'Bad Request', { 'Content-Type': 'text/plain' });
            res.write(cowsay.say({ text: 'bad request' }))
        }
        res.writeHead(200, 'OK', { 'Content-Type': 'text/html' });
        res.write('Hello!');
        res.end();
    });
}

function handleCowsayGet(res) {
    res.write(cowsay.say({ text: 'Hello from Cowville!' }));
    res.end();
}

function handleCowsayPost(req) {
    parseBody(req, function (err) {
        if (err) return console.error(err);
    });
    //it should send JSON that includes {"text": "<message>"}
}

server.listen(PORT, function () {
    console.log('Listening on Port:', PORT);
    console.log('http://localhost' + PORT);
});