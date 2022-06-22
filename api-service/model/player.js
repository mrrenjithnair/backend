'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');
const user = require('./user.js').user;
const userMessages = require('../modelConfig.js').getMessageConfig().user;
const systemConfig = require('../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);


const player = db.define('player', {
    userId: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    sportsTypeId: {
        type: sequelize.INTEGER,
        allowNull: true,
    },
    playerType: {
        type: sequelize.STRING,
        allowNull: true,
    },
    category: {
        type: sequelize.STRING,
        allowNull: true,
    },
    
}, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'PLAYER'
});
player.belongsTo(user);
player.removeAttribute('id')
module.exports = {
    player: player
};
