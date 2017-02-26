const Sequelize = require('sequelize');
const db = require('../db');
const cryptoExtra = require('../util/cryptoExtra');

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    nickname: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },

    token: {
        type: Sequelize.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true,

    classMethods: {
        async createNew(info) {
            const passwordHash = await cryptoExtra.encrypt(info.password);

            return User.create({
                email: info.email,
                nickname: info.nickname,
                password: passwordHash,
            });
        },

        async findByEmail(email) {
            return User.findOne({
                email,
            });
        },

        async findByNickname(nickname) {
            return User.findOne({
                nickname,
            });
        },

        async findByToken(token) {
            return User.findOne({
                token,
            });
        },

        async isUnique(email, nickname) {
            const findByEmail = await User.findByEmail(email);
            const findByNickname = await User.findByNickname(nickname);

            return !findByEmail && !findByNickname;
        },
    },

    instanceMethods: {
        comparePassword(password) {
            const decrypted = cryptoExtra.decrypt(this.get('password'));

            return decrypted === password;
        },

        async updateToken(token) {
            return this.update({
                token,
            });
        },

        getData() {
            return {
                email: this.get('email'),
                nickname: this.get('nickname'),
            };
        },
    },
});

module.exports = User;
