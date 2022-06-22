'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('./../modelConfig.js').getMessageConfig().user;
const systemConfig = require('./../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);


const user = db.define('user', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 25],
                msg: userMessages.nameFields.lengthValidation
            }
        }
    },
    lastName: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 25],
                msg: userMessages.nameFields.lengthValidation
            }
        }
    },
    emailId: {
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
    },
    username: {
        type: sequelize.STRING,
        allowNull: false,
        validate:{
            len: {
                args: [1, 25],
                msg: userMessages.username.lengthValidation
            }
        }
    },
    dob:{
        type: sequelize.BIGINT,
        allowNull: true,
        defaultValue: 0,
        validate: {
            birthdayValidation: function(value) {
                if (value < 0) {
                    throw new Error(userMessages.birthday.validation)
                }
            }
        }
    },
    password: passwordVault.vault('password', {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 100],
                msg: userMessages.password.lengthValidation
            }
        }
    }),
    roleId:{
        type: sequelize.INTEGER,
        allowNull: false,
    },
    mobile:{
        type: sequelize.INTEGER,
        allowNull: true,
    },
    location:{
        type: sequelize.INTEGER,
        allowNull: true,
    },
    village:{
        type: sequelize.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: true,
    paranoid: true,
    underscored: false,
    freezeTableName: true,
    tableName: 'USER'
});

module.exports = {
    user: user
};
