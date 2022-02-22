'use strict';

const sequelize = require('sequelize');
const db = require('./../db/dbConnection.js').get();

const roleMessages = require('./../modelConfig.js').getMessageConfig().role;

const role = db.define('role', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rolename: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [5, 100],
                msg: roleMessages.rolename.lengthValidation
            }
        }
    },
    description: {
        type: sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 1000],
                msg: roleMessages.description.lengthValidation
            }
        }
    },
    privileges: {
        type: sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 5000],
                msg: roleMessages.privileges.lengthValidation
            }
        }
    },
    createdBy: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [5, 100]
        }
    },
    updatedBy: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [5, 100]
        }
    }
}, {
    timestamps: false,
    paranoid: false,
    underscored: false,
    freezeTableName: true,
    tableName: 'ROLE',
    version: true
});

module.exports = {
    role: role
};
