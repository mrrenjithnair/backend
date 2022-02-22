'use strict';

const sequelize = require('sequelize');
const db = require('../db/dbConnection.js').get();
const encryptedField = require('sequelize-encrypted');

const userMessages = require('../modelConfig.js').getMessageConfig().user;
const systemConfig = require('../modelConfig.js').getSystemConfig();

const passwordVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);
const pinVault = encryptedField(sequelize, systemConfig.db.blobEncryptionKey);

const user = db.define('user', {
    entity_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true
    },
    /* password: passwordVault.vault('password', {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 100],
                msg: userMessages.password.lengthValidation
            }
        }
    }), */
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
    middle_name: {
        type: sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [0, 25],
                msg: userMessages.middleName.lengthValidation
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
    preferred_name: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 25],
                msg: userMessages.preferredName.lengthValidation
            }
        }
    },
    dob: {
        type: sequelize.DATE,
        allowNull: true,
        validate: {
            isDate: true,
        }
    },
    gender: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
        }
    },
    is_married: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
        }
    },
    occupation: {
        type: sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [1, 100],
                msg: userMessages.occupation.lengthValidation
            }
        }
    },
    mobile: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true,
                args: [0, 20],
                msg: userMessages.mobile.lengthValidation
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
    },
    owner_reltnship: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            len: {
                isInt: true
            }
        }
    },
    /* unit_mapping_id: {
        type: sequelize.INTEGER,
        allowNull: true,
        validate: {
            isInt: true,
        }
    }, */
    role_id: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
        }
    },
    actor_type: {
        type: sequelize.INTEGER,
        allowNull: true,
        validate: {
            isInt: true,
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
    updatedAt: 'lastupdated_dt',
    freezeTableName: true,
    tableName: 'USER_DTS',
    version: false
});

module.exports = {
    user: user
};
