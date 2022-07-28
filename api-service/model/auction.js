'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('./../modelConfig.js').getMessageConfig().user;
const systemConfig = require('./../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);


const auction = db.define('auction', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    venue: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 25],
                msg: userMessages.nameFields.lengthValidation
            }
        }
    },
    date: {
        type: sequelize.BIGINT,
        allowNull: false,
    },
    type: {
        type: sequelize.STRING,
        allowNull: false,
    },
    teamPoint: {
        type: sequelize.STRING,
        allowNull: false,
    },
    pointJson: {
        type: sequelize.JSON,
        allowNull: false,
    }
}, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'auction'
});

module.exports = {
    auction: auction
};
