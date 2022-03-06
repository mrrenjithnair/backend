'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('../modelConfig.js').getMessageConfig().user;
const systemConfig = require('../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);


const team_owner_mapping = db.define('team_owner_mapping', {
    clubId:{
        type: sequelize.INTEGER,
        allowNull: false,
    },
    userId:{
        type: sequelize.INTEGER,
        allowNull: false,
    },
    teamId:{
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
    tableName: 'team_owner_mapping'
});

module.exports = {
    team_owner_mapping: team_owner_mapping
};
