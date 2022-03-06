'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('../modelConfig.js').getMessageConfig().user;
const systemConfig = require('../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);


const tournament_team_mapping = db.define('tournament_team_mapping', {
    tournament_id:{
        type: sequelize.INTEGER,
        allowNull: false,
    },
    team_id:{
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
    tableName: 'tournament_team_mapping'
});

module.exports = {
    tournament_team_mapping: tournament_team_mapping
};
