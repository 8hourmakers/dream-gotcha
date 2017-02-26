const Sequelize = require('sequelize');
const db = require('../db');

const Dream = db.define('dream', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: db.models.user,
            key: 'id',
        },
    },

    text: {
        type: Sequelize.TEXT,
        allowNull: false,
    },

    audio: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
    },
}, {
    freezeTableName: true,

    classMethods: {
        async isNotExists(id) {
            const dream = await Dream.findById(id);

            return !dream;
        },
    },

    instanceMethods: {
        async getData(userId) {
            const likes = await this.getLikes();
            const hasMyLike = likes.reduce((has, like) => {
                if (has) return true;
                return like.userId === userId;
            }, false);

            return {
                id: this.get('id'),
                text: this.get('text'),
                like: {
                    count: likes.length,
                    myLike: hasMyLike,
                },
                timestamp: this.get('timestamp'),
            };
        },
    },
});

module.exports = Dream;
