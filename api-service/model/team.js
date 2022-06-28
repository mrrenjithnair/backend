'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('./../modelConfig.js').getMessageConfig().user;
const systemConfig = require('./../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);


const team = db.define('team', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 25],
                msg: userMessages.nameFields.lengthValidation
            }
        }
    },
    logo: {
        type: sequelize.STRING,
        allowNull: true,
    },
    ownerId:{
        type: sequelize.INTEGER,
        allowNull: true,
    },
    clubId:{
        type: sequelize.INTEGER,
        allowNull: true,
    },
    tournamentId:{
        type: sequelize.INTEGER,
        allowNull: true,
    }
    
}, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'team'
});

module.exports = {
    team: team
};
