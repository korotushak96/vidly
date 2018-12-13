const winston = require('winston');
const express = require("express");
const app = express();

require('./sturtup/config')();
require('./sturtup/logging')();
require('./sturtup/routes')(app);
require('./sturtup/data')();
require('./sturtup/prod')(app);

process.on('warning', e => winston.info(e.stack));
 
module.exports = app;