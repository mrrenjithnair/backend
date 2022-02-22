'use strict';

const sequelize = require('sequelize');
const config = require('./../modelConfig.js').getSystemConfig();

sequelize.cls = require("continuation-local-storage").createNamespace("db");

const dbConnectionObj = new function() {

    this.getEnvVariable = function(name) {
        var value = process.env[name];
        if (!value) {
            value = config.db[name];
        }
        return value;
    }

    this.db = new sequelize(this.getEnvVariable("dbname"), this.getEnvVariable("dbusername"), this.getEnvVariable("dbpassword"), {
        host: this.getEnvVariable("dbhost"),
        // logging: (msg) => logger.info(msg),
        dialect: config.db.dialect,
        engine: config.db.mysqlEngine,
        dialectOptions: {
            charset: 'utf8mb4',
        },
        pool: {
            max: config.db.maxConnectionLimit,
            min: config.db.minConnectionLimit,
            idle: config.db.idleTimeout
        }
    });

    this.applyTx = function(txFunction, arg) {
        return this.db.transaction({
            autocommit: false
        }, function(t) {
            if (arg)
                return txFunction(arg);
            else
                return txFunction();
        });
    }

    this.get = function() {
        return this.db;
    }
}

module.exports = dbConnectionObj;
