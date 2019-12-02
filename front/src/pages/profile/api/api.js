const config_api = require("../../../config/config").config_api;
const utils = require("../../../utils/utils");
const axios = require('axios');

function ModalAPI_(url, method, contentType, data, callback) {
    axios({
        url: url,
        method: method,
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + utils.getAuthToken()
        },
        withCredentials: true,
        data: data
    }).then(result => {
        return callback(false, result.data)
    }).catch(error => {
        if (error.response) {
            return callback(error.response)
        } else if (error.request) {
            return callback("Please check your internet connection to server");
        } else {
            return callback(error.message)
        }
    });
}
function getUserInfo(email, callback) {
    if (email === '' && window.location.search === '')
        ModalAPI_(config_api.path + 'users/me', 'GET', 'application/json', null, (err, result) => {
            if (err) { return callback(err) }
            else { return callback(null, result) }
        });
    else
        ModalAPI_(config_api.path + 'users?email=' + email, 'GET', 'application/json', null, (err, result) => {
            if (err) { return callback(err) }
            else { return callback(null, result[0]) }
        })
}

function getContacts(id, callback) {
    ModalAPI_(config_api.path + 'users', 'GET', 'application/json', null, (err, result) => {
        if (err) { return callback(err) }
        else { return callback(null, result) }
    })
}

function getProject(callback) {
    ModalAPI_(config_api.project, 'GET', 'application/json', null, (err, result) => {
        if (err) { return callback(err) }
        else { return callback(null, result) }
    })
}

function updateUserInfo(data, callback) {
    ModalAPI_(config_api.path + 'users/me' , 'PATCH', 'application/json', data, (err, result) => {
        if (err) { return callback(err) }
        else { return callback(null, result) }
    })
}

function updateAvatar(photo, callback) {
    axios({
        url: config_api.path + 'users/change_avatar',
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + utils.getAuthToken()
        },
        withCredentials: true,
        data: photo
    }).then(result => {
        return callback(false, result.data)
    })
    .catch(error => {
        if (error.response) {
            return callback(error.response)
        } else if (error.request) {
            return callback("Please check your internet connection to server");
        } else {
            return callback(error.message)
        }
    });
}

module.exports = {
    getUserInfo: getUserInfo,
    getContacts: getContacts,
    getProject: getProject,
    updateUserInfo: updateUserInfo,
    updateAvatar: updateAvatar
};
