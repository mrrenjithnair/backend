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

const CLUB_LIST = " SELECT c.* FROM CLUB C " +
    " INNER JOIN CLUB_USER_MAPPING CUM ON CUM.CLUBID = C.ID " +
    " INNER JOIN USER U ON U.ID = CUM.USERID " +
    " WHERE U.DELETEDAT IS NULL " 

const securityDao = new function () {
    this.authenticate = function (username, password, secret = null, deviceId = null, webapp = false) {
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
                } else {
                    throw exceptionUtil.createSPException(config.security.invalidUserNamePasswd);
                }
            } catch (error) {
                if (error instanceof SPException)
                    throw error;
                else
                    throw exceptionUtil.createSPException(config.security.invalidUserNamePasswd);
            }
        }).then((user) => {
            if (user && user.length > 0) {
                let query1 = CLUB_LIST
                if (user && user[0] && user[0].roleId == 2) {
                    queryReplacement.userId = user[0].id
                    if (queryReplacement.userId) {
                        query1 += " AND U.ID =:userId "
                    }
                    return db.query(query1, {
                        replacements: queryReplacement,
                        type: db.QueryTypes.SELECT
                    }).then((club) => {
                        user[0].club = club
                        return user
                    })
                }else{
                    return user
                }
            }
        }).then((user) => {
            return user
        })
    }

};

module.exports = securityDao;
