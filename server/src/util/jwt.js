const jwt = require('jsonwebtoken');
const appConfig = require('../../configs/app.conf');

const sign = data => new Promise((resolve, reject) => {
    jwt.sign(data, appConfig.jwtSecret, {}, (err, token) => {
        if (err) reject(err);
        else resolve(token);
    });
});

const verify = token => new Promise((resolve, reject) => {
    jwt.verify(token, appConfig.jwtSecret, (err, data) => {
        if (err) reject(err);
        else resolve(data);
    });
});

module.exports = {
    sign,
    verify,
};
