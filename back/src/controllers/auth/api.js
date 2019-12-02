/**
 * @version 1.0.0
 */
const express = require('express');
const api = express();
const serviceAuth = require('./services');

api.post('/', serviceAuth.login);
api.post('/register', serviceAuth.register);

module.exports = api;
