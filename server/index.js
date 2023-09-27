'use strict';

const express = require('express');
const http = require('http');
const fs = require('fs');
const debug = require('debug');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'public', 'css')));
app.use(express.static(path.join(__dirname, '..', 'public', 'img')));
app.use(express.static(path.join(__dirname, '..', 'public', 'js')));

const SERVER_PORT = 3000;

// app.use()

app.get('/', (req, res) => {
  // res.write
  //   res.send('Hello World!');
  res.sendFile('index.html')
});

app.listen(SERVER_PORT, () => {
  debug.log(`Frontend-server listening on port ${SERVER_PORT}`);
});

// const server = http.createServer((request, response) => {
//     const {url} = request;
//     debug.log('url: ' + url);
//     const normalizedUrl = url === '/' ? '/index.html' : url;
//     const filepath = `../public${normalizedUrl}`;
//     debug.log('filepath: ' + filepath);

//     fs.readFile(filepath, (err, data) => {
//         if (err) {
//             debug.log('error: ' + JSON.stringify(err));
//             // response.write(page404);
//             response.end('NO');
//             return;
//         }

//         response.write(data);
//         response.end();
//     })
// });

// debug.log('Starting server...');
// server.listen(SERVER_PORT);
