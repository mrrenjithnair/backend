'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('./../modelConfig.js').getMessageConfig().user;
const systemConfig = require('./../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);


const club_player_mapping = db.define('club_player_mapping', {
    clubId:{
        type: sequelize.INTEGER,
        allowNull: false,
    },
    playerId:{
        type: sequelize.INTEGER,
        allowNull: false,
    },
    approved:{
        type: sequelize.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'CLUB_PLAYER_MAPPING'
});

module.exports = {
    club_player_mapping: club_player_mapping
};
