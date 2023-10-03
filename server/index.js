'use strict';

const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors')

app.use(express.static(path.join(__dirname, '..', 'public')));
const SERVER_PORT = 3000;

app.listen(SERVER_PORT, () => {
  console.debug(`Frontend-server listening on port ${SERVER_PORT}`)
});
