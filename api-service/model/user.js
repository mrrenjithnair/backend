'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('./../modelConfig.js').getMessageConfig().user;
const systemConfig = require('./../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);
const pinVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);

const user = db.define('user', {

    user_id: {
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true
    },
    first_name: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 25],
                msg: userMessages.nameFields.lengthValidation
            }
        }
    },
    last_name: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 25],
                msg: userMessages.nameFields.lengthValidation
            }
        }
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: userMessages.emailId.emptyValidation
            },
            isEmail: {
                msg: userMessages.emailId.validation
            }
        }
    }
}, {
    timestamps: true,
    paranoid: false,
    underscored: true,
    createdAt: 'entry_dt',
    updatedAt: 'lastupdated_dt',
    freezeTableName: true,
    tableName: 'USER_DTS',
    version: false
});

module.exports = {
    user: user
};
