'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('./../modelConfig.js').getMessageConfig().user;
const systemConfig = require('./../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);


const club = db.define('club', {
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
    location: {
        type: sequelize.STRING,
        allowNull: false,
    },
    logo: {
        type: sequelize.STRING,
        allowNull: true,
    },
    banner: {
        type: sequelize.STRING,
        allowNull: true,
    },
    address: {
        type: sequelize.STRING,
        allowNull: false,
    },
    sportType:{
        type: sequelize.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'CLUB'
});

module.exports = {
    club: club
};
