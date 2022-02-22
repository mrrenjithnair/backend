'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const documentMessages = require('../modelConfig.js').getMessageConfig().document;
const systemConfig = require('../modelConfig.js').getSystemConfig();



const document_dts = db.define('document_dts', {
    doc_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    entity_id: {
        type: sequelize.INTEGER,
        allowNull: true,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    ddlentity_type: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    document_no: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 20],
                msg: documentMessages.document_no.lengthValidation
            }
        }
    },
    image: {
        type: sequelize.STRING,
        allowNull: true
    },
    is_active: {
        type: sequelize.INTEGER,
        allowNull: true
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
    tableName: 'DOCUMENT_DTS',
    version: false
});

module.exports = {
    document_dts: document_dts
};
