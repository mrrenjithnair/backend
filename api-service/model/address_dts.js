'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const addressMessages = require('../modelConfig.js').getMessageConfig().address;
const systemConfig = require('../modelConfig.js').getSystemConfig();



const address_dts = db.define('address_dts', {
    entity_id: {
        type: sequelize.INTEGER,
        primaryKey: true
    },
    unit_id: {
        type: sequelize.INTEGER,
        allowNull: true,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    address1: {
        type: sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [1, 55],
                msg: addressMessages.address.lengthValidation
            }
        }
    },
    address2: {
        type: sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [1, 55],
                msg: addressMessages.address.lengthValidation
            }
        }
    },
    is_active: {
        type: sequelize.INTEGER,
        allowNull: true,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    entry_by: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 25]
        }
    },
    updated_by: {
        type: sequelize.STRING,
        allowNull: true,
        validate: {
            len: [1, 25]
        }
    }
}, {
    timestamps: true,
    paranoid: false,
    underscored: true,
    createdAt: 'entry_dt',
    updatedAt: 'updated_dt',
    freezeTableName: true,
    tableName: 'ADDRESS_DTS',
    version: false
});

module.exports = {
    address_dts: address_dts
};
