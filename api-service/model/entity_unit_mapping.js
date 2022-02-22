'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const unitMessages = require('../modelConfig.js').getMessageConfig().unit;
const systemConfig = require('../modelConfig.js').getSystemConfig();



const entity_unit_mapping = db.define('entity_unit_mapping', {
    unit_mapping_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    entity_id: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    unit_id: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    is_owner: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    is_resident: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    is_rented: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    /* owner_reltnship: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true
            }
        }
    }, */
    is_active: {
        type: sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    /* role_id: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true
            }
        }
    }, */
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
    tableName: 'ENTITY_UNIT_MAPPING',
    version: false
});

module.exports = {
    entity_unit_mapping: entity_unit_mapping
};
