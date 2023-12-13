'use strict';

const FRONTEND_SERVER_PORT = 8084;
const FRONTEND_POLL_SERVER_PORT = 8085;

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const poll_app = express();

app.engine(
  'handlebars',
  exphbs.engine({
    extname: 'handlebars',
    layoutsDir: path.join(__dirname, '..', 'views/layouts'),
    partialsDir: path.join(__dirname, '..', 'views/partials'),
    }),
);

poll_app.engine(
  'handlebars',
  exphbs.engine({
    extname: 'handlebars',
    layoutsDir: path.join(__dirname, '..', 'views/layouts'),
    partialsDir: path.join(__dirname, '..', 'views/partials'),
    }),
);

app.set('view engine', 'handlebars');
poll_app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '..')));
poll_app.use(express.static(path.join(__dirname, '..')));

app.get('/*', (req, res) => {
  res.render('pages/main');
  console.log('render');
});

poll_app.get('/csatpoll', (req, res) => {
  res.render('pages/poll');
  console.log('render poll!');
})

app.listen(FRONTEND_SERVER_PORT, () => {
  console.debug(`Frontend-server listening on port ${FRONTEND_SERVER_PORT}`);
});

poll_app.listen(FRONTEND_POLL_SERVER_PORT, () => {
  console.debug(`Frontend-server listening on port ${FRONTEND_POLL_SERVER_PORT}`);
});
