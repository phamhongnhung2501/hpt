const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const logColor = require('./src/untils/logColor');
const response = require('./src/controllers/base/response');
const configDB = require('./config/database');

/** Environment variables.*/
if(process.env.NODE_ENV==="DEV") require('custom-env').env('development',__dirname);

/** Init*/
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('static'));
app.use(cors({
    origin: true,
    credentials: true
}));

/** Router */
const router = require('./src/router');
app.use('/api/v1', router);

app.use((err, req, res, next) => {
    if (err) {
        logColor('color:red Invalid Request data!');
        return response.badRequest(res, 'Invalid data !');
    } else {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }
});

/** Database */
mongoose.connect(configDB.setting.url, configDB.options).then(
    () => {logColor(`MongoDB ready to use: color:green${configDB.setting.url}`);},
    err => {console.error( Error(` Unable to connect to database \n${err}`) );}
);

module.exports = app;