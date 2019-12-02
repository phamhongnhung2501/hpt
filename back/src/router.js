const express = require('express');
const router = express();

const auth = require('./controllers/auth/api');
router.use('/auth', auth);

const data = require('./controllers/miband3/data/api');
router.use('/data', data);

const miband = require('./controllers/miband3/info/api');
router.use('/miband', miband);

const user = require('./controllers/user/api');
router.use('/users', user);

module.exports = router;