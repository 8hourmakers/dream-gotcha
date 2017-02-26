/* eslint no-param-reassign:0 */
const User = require('../model/user');

async function ensureAuth(req, res, next) {
    const bearerHeader = req.headers.authorization || null;

    if (!bearerHeader) {
        res.status(403);
        res.end();
        return;
    }

    const token = bearerHeader.split(' ')[1];
    const user = await User.findByToken(token);

    if (user) {
        req.token = token;
        next();
    } else {
        res.status(403);
        res.end();
    }
}

module.exports = ensureAuth;
