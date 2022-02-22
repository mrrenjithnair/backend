'use strict';

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const securityDao = require('./../../dao/securityDao.js');
const httpUtils = require('./../../httpUtils.js');

const config = require('../../config.js').getSecurityConfig();

const TOKEN_EXPIRATION_TIME = config.security.expires;

module.exports = {
    authenticate: authenticate,
    validateToken: validateToken,
    refreshToken: refreshToken,
    logout: logout,
    fetchKey: fetchKey,
};

function logout(req, res) {
    let deviceId = req.headers.deviceid;
    console.log(req.headers);
    if(!deviceId || deviceId.toLowerCase() == 'Browser') {
        res.status(200).json('success');
        return ;
    }

    let apiKey = req.headers.api_key;
    let securityParam = {
        'api_key': apiKey
    };
    let userId = req.token[0].id;
    let url = config.operationsService.deleteDeviceTokenByDeviceId;
    let requestNameValuePairs = {
        'userId': userId,
        'deviceId': deviceId
    };

    return httpUtils.httpDelete(url, securityParam, requestNameValuePairs)
        .then(() => {
            res.status(200).json('success');
        }).catch((err) => {
            res.status(200).json('success');
        });
}

function authenticate(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    let user = req.swagger.params.authRequest.value;
    let webapp = user.webapp ? user.webapp : false
    let authenticateUser = () => {
        return securityDao.authenticate(user.username, user.password, req.headers.secret, req.headers.deviceid, webapp )
        .then((userModel) => {
            //Keep only the necessary items in token object
            let tokenUserModel = []
            if (userModel && userModel.length>0) {
                var user = {
                    id: userModel[0].id,
                    username: userModel[0].username,
                    givenName: userModel[0].givenName,
                    familyName: userModel[0].familyName,
                    pin: userModel[0].pin,
                    emailId: userModel[0].emailId,
                    emailVerified: userModel[0].emailVerified,
                    emailId1: userModel[0].emailId1,
                    emailVerified1: userModel[0].emailVerified1,
                    emailId2: userModel[0].emailId2,
                    emailVerified2: userModel[0].emailVerified2,
                    rolename: userModel[0].rolename,
                    roleId: userModel[0].roleId,
                    referralSourceId: userModel[0].referralSourceId,
                    referralSourceName: userModel[0].referralSourceName,
                    preferenceSetDate: userModel[0].preferenceSetDate
                }
                tokenUserModel.push(user)
            }
            // if user is found and password is right, create a token
            let token = jwt.sign(tokenUserModel, config.security.secret, {
                expiresIn: TOKEN_EXPIRATION_TIME
            });

            return {
                token: token,
                expires: TOKEN_EXPIRATION_TIME,
                user: userModel
            };
        })
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, authenticateUser);
}

function refreshToken(req, res) {
    let user = req.token;
    return securityDao.getUser(user[0].username)
    .then((userModel) => {
        delete userModel.exp;
        delete userModel.iat;
        let token = jwt.sign(userModel, config.security.secret, {
            expiresIn: TOKEN_EXPIRATION_TIME
        });
        res.status(200).send({
            token: token,
            expires: TOKEN_EXPIRATION_TIME,
            user: userModel
        });
    }).catch((err) => {
        controllerUtils.handleError(req, res, err);
    })
}

function validateToken(req, res) {
    let token = req.token;
    delete token.exp;
    delete token.iat;
    res.status(200).send(req.token);
}

function fetchKey(req, res) {
    let username = req.swagger.params.username.value;

    let fetchUserKey = () => {
        return securityDao.fetchUserKey(username);
    };
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, fetchUserKey);
}
