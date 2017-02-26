const Sequelize = require('sequelize');
const db = require('../db');

const Like = db.define('like', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    dreamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: db.models.dream,
            key: 'id',
        },
    },

    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: db.models.user,
            key: 'id',
        },
    },
}, {
    freezeTableName: true,

    classMethods: {
        async isUserLiked(dreamId, userId) {
            const like = await Like.findOne({
                dreamId,
                userId,
            });

            return !!like;
        },
    },
});

module.exports = Like;
