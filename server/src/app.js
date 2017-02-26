const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authCtrl = require('./controller/auth');
const dreamCtrl = require('./controller/dream');
const appConfig = require('../configs/app.conf');

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.set('port', appConfig.port);
app.use(bodyParser.json());

app.use('/dream-gotcha', authCtrl);
app.use('/dream-gotcha', dreamCtrl);

module.exports = app;
