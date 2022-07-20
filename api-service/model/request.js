'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('./../modelConfig.js').getMessageConfig().user;
const systemConfig = require('./../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);


const request = db.define('request', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: sequelize.STRING,
        allowNull: true,
    },
    userId:{
        type: sequelize.INTEGER,
        allowNull: true,
    },
    clubId:{
        type: sequelize.INTEGER,
        allowNull: true,
    },
    approved:{
        type: sequelize.INTEGER,
        allowNull: true, 
        defaultValue: 0
    },
    tournamentId:{
        type: sequelize.INTEGER,
        allowNull: true,
    },
    assigned:{
        type: sequelize.INTEGER,
        allowNull: true,  
        defaultValue: 0
    }
    
}, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'request'
});

module.exports = {
    request: request
};
