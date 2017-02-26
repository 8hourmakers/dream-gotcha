/* eslint global-require:0 */
const http = require('http');
const db = require('./db');
const app = require('./app');
const logger = require('./util/logger');

async function run() {
    const Dream = require('./model/dream');
    const Like = require('./model/like');
    const User = require('./model/user');

    Dream.hasMany(Like, {
        as: 'Likes',
        foreignKey: 'dreamId',
    });

    User.hasMany(Like, {
        as: 'Likes',
        foreignKey: 'userId',
    });

    User.hasMany(Dream, {
        as: 'Dreams',
        foreignKey: 'userId',
    });

    await db.sync();

    return new Promise((resolve, reject) => {
        http.createServer(app).listen(app.get('port'), (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

run()
    .then(() => {
        logger.info('Server running.');
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });
