'use strict';

const express = require('express');
const path = require('path');
const app = express();

// app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'public', 'css')));
app.use(express.static(path.join(__dirname, '..', 'public', 'img')));
app.use(express.static(path.join(__dirname, '..', 'public', 'js')));
const SERVER_PORT = 3000;

app.listen(SERVER_PORT, () => {
  console.debug(`Frontend-server listening on port ${SERVER_PORT}`)
});
