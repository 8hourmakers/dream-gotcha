const Speech = require('@google-cloud/speech');
const appConfig = require('../../configs/app.conf');

const speech = Speech({
    projectId: appConfig.google.projectId,
    keyFilename: appConfig.google.keyfile,
});

module.exports = speech;
