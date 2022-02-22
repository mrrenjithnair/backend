'use strict';

const exceptionUtil = require('../exceptionUtils.js');

const config = require('../config.js').getMessageConfig();
const securityConfig = require('../config.js').getSecurityConfig();
const passwordGen = require('generate-password');

const SPException = require('../SPException.js');
const userDbModel = require('../model/user.js').user;
const db = require('../db/dbConnection.js').get();

//Do not change this query to uppercase since it will affect the token structure
const AUTHENTICATE_QUERY = " SELECT * FROM USER U " +
    " where (u.username = :username or u.emailId = :username) and u.deletedAt is null ";

const UPDATE_DEVICE_USER = " UPDATE DEVICE_TOKEN SET USERID = :providerId WHERE deviceId = :deviceId  ";

const UPDATE_LAST_LOGIN = " UPDATE USER SET LASTLOGIN =:lastLogin WHERE ID = :userId  ";

const SELECT_PASSWORD_FOR_ADMIN_OPERATOR = "SELECT PASSWORD FROM USER WHERE ROLEID = 1";
const UPDATE_OTP = "UPDATE USER SET OTP = :password WHERE USERNAME = :username";

const GET_USER_CONTACTS = " SELECT CT.emailId, CT.emailVerified, CT.firstName, CT.lastName, CT.ID contactId, UCT.primaryEmail, UCT.primaryPhone, " +
    " IF(CT.phoneNumberExtn IS NOT NULL, CONCAT(CT.phoneNumber, ' Extn ', CT.phoneNumberExtn), CT.phoneNumber) phoneNumber " +
    " FROM USER_CONTACT UCT " +
    " INNER JOIN CONTACT CT ON CT.ID = UCT.CONTACTID " +
    " WHERE CT.DELETEDAT IS NULL AND UCT.USERID = :userId "

const GET_USER_TOKEN_AND_VISIT_COUNT = " SELECT U.ID, DT.DEVICETOKEN, COUNT(PVT.VISITID) TOTALVISITCOUNT, CT.ID BACKOFFICESUPPORTID  FROM USER U  " +
    " LEFT OUTER JOIN DEVICE_TOKEN DT ON DT.USERID = U.ID " +
    " LEFT OUTER JOIN PROVIDER_VISIT PVT ON PVT.PROVIDERUSERID = U.ID " +
    " LEFT OUTER JOIN VISIT VI ON VI.ID = PVT.VISITID " +
    " LEFT OUTER JOIN CHAT_TOPIC CT ON CT.PROVIDERUSERID = U.ID AND CT.EPISODEID IS NULL AND CT.TYPE IS NULL " +
    " WHERE U.ID = :userId AND VI.DELETEDAT IS NULL " ;

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
                let pinFromDB = modelUtil.decryptBlob(r[0].pin);
                r[0].pin = pinFromDB
                let passwordFromDB = modelUtil.decryptBlob(r[0].password);
                if (password == passwordFromDB) {
                    delete r[0].password;
                    delete r[0].otp;
                    if(r[0].headlessUser) {
                        if(!secret || securityConfig.security.secret !== secret) {
                            let ex = exceptionUtil.createSPException(config.security.invalidSecret);
                            throw ex;
                        }
                    }

                    return r;
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

    this.getUser = function(username) {
        let queryReplacement = {
            'username': username
        };
        return db.query(AUTHENTICATE_QUERY, {
            replacements: queryReplacement,
            type: db.QueryTypes.SELECT
        }).then((r) => {
            if (r.length != 1)
                throw exceptionUtil.createSPException(config.security.invalidTokenUser);

            let pinFromDB = modelUtil.decryptBlob(r[0].pin);
            r[0].pin = pinFromDB
            delete r[0].password;
            return r;
        });
    }
    this.updateLastLogin =function(userId,lastLogin) {
        let queryReplacement = {
            'userId': userId,
            'lastLogin':lastLogin
        };
        return db.query(UPDATE_LAST_LOGIN, {
            replacements: queryReplacement,
            type: db.QueryTypes.UPDATE
        }).then((res) => {
            return res;
        });
    }

    this.fetchUserKey = function(username) {
        let password = passwordGen.generate({
            length: sysConfig.OTP.password.length,
            numbers: sysConfig.OTP.password.includeNumbers,
            uppercase: sysConfig.OTP.password.includeUpperCase
        });

        let queryReplacement = {
            'username': username,
            'password': password,
        };
        return db.query(UPDATE_OTP, {
            replacements: queryReplacement,
            type: db.QueryTypes.UPDATE
        }).then(() => {
            return {key: password}
        });
    }
};

module.exports = securityDao;
