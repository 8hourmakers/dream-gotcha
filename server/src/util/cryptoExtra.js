const crypto = require('crypto');
const appConfig = require('../../configs/app.conf');

const algorithm = appConfig.crypto.algorithm;
const secret = appConfig.crypto.secret;

module.exports = {
    decrypt(plainText) {
        const cipher = crypto.createDecipher(algorithm, secret);
        let dec = cipher.update(plainText, 'hex', 'utf8');

        dec += cipher.final('utf8');

        return dec;
    },

    encrypt(plainText) {
        const cipher = crypto.createCipher(algorithm, secret);
        let crypted = cipher.update(plainText, 'utf8', 'hex');

        crypted += cipher.final('hex');

        return crypted;
    },
};
