'use strict';
// import router from '../public/js/router/router.js';

const FRONTEND_SERVER_PORT = 8084;

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

app.engine(
  'handlebars',
  exphbs.engine({
    extname: 'handlebars',
    layoutsDir: path.join(__dirname, '..', 'views/layouts'),
    partialsDir: path.join(__dirname, '..', 'views/partials'),
    }),
);

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '..')));

app.get('/*', (req, res) => {
  res.render('layouts/main');
  console.log('render');
});

app.listen(FRONTEND_SERVER_PORT, () => {
  console.debug(`Frontend-server listening on port ${FRONTEND_SERVER_PORT}`);
});
