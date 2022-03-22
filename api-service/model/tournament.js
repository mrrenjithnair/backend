'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('../modelConfig.js').getMessageConfig().user;
const systemConfig = require('../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);


const tournament = db.define('tournament', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    logo: {
        type: sequelize.STRING,
        allowNull: true,
    },
    name: {
        type: sequelize.STRING,
        allowNull: true,
    },
    startDate: {
        type: sequelize.BIGINT,
        allowNull: true,
    },
    endDate: {
        type: sequelize.BIGINT,
        allowNull: true,
    },
    teamTotal: {
        type: sequelize.STRING,
        allowNull: true,
    },
    memberTotal:{
        type: sequelize.INTEGER,
        allowNull: true,
    },
    clubId:{
        type: sequelize.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'tournament'
});

module.exports = {
    tournament: tournament
};
