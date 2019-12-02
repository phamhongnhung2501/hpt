const express = require('express');
const api = express();
const serviceInfo = require('./services');
const Auth = require('../../auth/services').authentication;

api.get('/', Auth, serviceInfo.getDevice);
api.get('/:mac', Auth, serviceInfo.getDeviceById);
api.post('/', Auth, serviceInfo.newDevice);
api.post('/add_substation', Auth, serviceInfo.addDeviceToUser);
api.post('/change_logo', Auth, serviceInfo.changeLogo);
api.patch('/:mac', Auth, serviceInfo.editDevice);
api.delete('/:mac', Auth, serviceInfo.deleteDevice);

module.exports = api;