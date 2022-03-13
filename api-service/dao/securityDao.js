'use strict';

const exceptionUtil = require('../exceptionUtils.js');

const config = require('../config.js').getMessageConfig();
const securityConfig = require('../config.js').getSecurityConfig();
const passwordGen = require('generate-password');

const SPException = require('../SPException.js');
const userDbModel = require('../model/user.js').user;
const db = require('../db/dbConnection.js').get();
const modelUtils = require('./../modelUtils.js');


//Do not change this query to uppercase since it will affect the token structure
const AUTHENTICATE_QUERY = " SELECT U.*, R.privileges  FROM USER U " +
    " INNER JOIN ROLE R ON  R.ID = U.ROLEID " +
    " where (u.username = :username or u.emailId = :username) and u.deletedAt is null ";


const securityDao = new function() {
    this.authenticate = function(username, password, secret = null, deviceId = null, webapp = false) {
        let user = null
        let queryReplacement = {
            'username': username
        };
        return db.query(AUTHENTICATE_QUERY, {
            replacements: queryReplacement,
            type: db.QueryTypes.SELECT
        }).then((r) => {

            if (r.length != 1)
                throw exceptionUtil.createSPException(config.security.invalidUserNamePasswd);
            try {
                let passwordFromDB = modelUtils.decryptBlob(r[0].password);
                if (password == passwordFromDB) {
                    return r;
                } else{
                throw exceptionUtil.createSPException(config.security.invalidUserNamePasswd);
                }
            } catch (error) {
              if(error instanceof SPException)
                throw error;
              else
                throw exceptionUtil.createSPException(config.security.invalidUserNamePasswd);
            }
        }).then((user) => {
            return user
        })
    }

};

module.exports = securityDao;
