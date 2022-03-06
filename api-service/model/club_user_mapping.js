'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('../modelConfig.js').getMessageConfig().user;
const systemConfig = require('../modelConfig.js').getSystemConfig();



const club_user_mapping = db.define('club_user_mapping', {
    clubId:{
        type: sequelize.INTEGER,
        allowNull: false,
    },
    userId:{
        type: sequelize.INTEGER,
        allowNull: false,
    },
    approved:{
        type: sequelize.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: false,
    paranoid: false,
    underscored: false,
    freezeTableName: true,
    tableName: 'CLUB_USER_MAPPING',
    version: false
});
club_user_mapping.removeAttribute('id')

module.exports = {
    club_user_mapping: club_user_mapping
};
