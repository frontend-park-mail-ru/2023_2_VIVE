'use strict';

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
const SERVER_PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'templates', 'index.html'));
});

app.get('/templates/employer_reg.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'templates', 'employer_reg.html'));
});

app.get('/templates/employer_sign_in.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'templates', 'employer_sign_in.html'));
});

app.get('/templates/applicant_reg.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'templates', 'applicant_reg.html'));
});

app.get('/templates/applicant_sign_in.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'templates', 'applicant_sign_in.html'));
});

app.listen(SERVER_PORT, () => {
  console.debug(`Frontend-server listening on port ${SERVER_PORT}`)
});
