'use strict';

const FRONTEND_SERVER_PORT = 8082;

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

app.engine(
  'hbs',
  exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '..', 'views/layouts'),
    partialsDir: path.join(__dirname, '..', 'views/partials'),
  })
);

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
  res.render('pages/vacancies');
  console.log('ok!');
});

app.get('/app_reg', (req, res) => {
  res.render('pages/app_reg');
  console.log('ok!');
});

app.get('/app_login', (req, res) => {
  res.render('pages/app_login');
  console.log('ok!');
});

app.get('/emp_reg', (req, res) => {
  res.render('pages/emp_reg');
  console.log('ok!');
});

app.get('/emp_login', (req, res) => {
  res.render('pages/emp_login');
  console.log('ok!');
});

app.listen(FRONTEND_SERVER_PORT, () => {
  console.debug(`Frontend-server listening on port ${FRONTEND_SERVER_PORT}`);
});
