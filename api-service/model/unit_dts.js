'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const unitMessages = require('../modelConfig.js').getMessageConfig().unit;
const systemConfig = require('../modelConfig.js').getSystemConfig();



const unit_dts = db.define('unit_dts', {
    unit_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    floor_id: {
        type: sequelize.INTEGER,
        allowNull: true,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    wing_id: {
        type: sequelize.INTEGER,
        allowNull: true,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    unit_no: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 20],
                msg: unitMessages.unit_no.lengthValidation
            }
        }
    },
    project_id: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    description: {
        type: sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [1, 250],
                msg: unitMessages.description.lengthValidation
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
    tableName: 'UNIT_DTS',
    version: false
});

module.exports = {
    unit_dts: unit_dts
};
