const winston = require('winston');
const appConfig = require('../../configs/app.conf');

const logger = new winston.Logger({
    level: appConfig.log.level,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: appConfig.log.filename,
        }),
    ],
});

module.exports = logger;
