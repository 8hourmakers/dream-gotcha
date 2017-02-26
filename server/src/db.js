/* eslint comma-dangle:0 */
const Sequelize = require('sequelize');
const appConfig = require('../configs/app.conf');

const db = new Sequelize(
    appConfig.db.name,
    appConfig.db.username,
    appConfig.db.password,
    {
        dialect: appConfig.db.dialect,
        storage: appConfig.db.storage,
    }
);

module.exports = db;
