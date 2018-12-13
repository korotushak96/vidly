require('express-async-errors');
const winston = require('winston');
// require('winston-mongodb');

module.exports = function(){
    winston.handleExceptions(
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({filename: 'unCaughtExceptions.log'}))

    process.on('unhandledRejections', (err)=>{
        throw ex;
    }); 

    winston.add(winston.transports.File, {filename: 'logfile.log'});
    // winston.add(winston.transports.MongoDB, ({db: 'mongodb://localhost/genres'}))

}