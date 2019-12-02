const express = require('express');
const api = express();
const serviceProject = require('./services');
const auth = require('../../auth/services').authentication;

api.get('/:mac', auth, serviceProject.getDeviceDataById);
api.post('/:mac', serviceProject.getDataByIdAndTime);

module.exports = api;