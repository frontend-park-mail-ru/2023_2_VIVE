'use strict';

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors')

app.use(express.static(path.join(__dirname, '..', 'public')));
const SERVER_PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'templates', 'index.html'));
});

app.listen(SERVER_PORT, () => {
  console.debug(`Frontend-server listening on port ${SERVER_PORT}`)
});
