'use strict';

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const securityDao = require('./../../dao/securityDao.js');
const config = require('../../config.js').getSecurityConfig();
const TOKEN_EXPIRATION_TIME = config.security.expires;

module.exports = {
    authenticate: authenticate,
    validateToken: validateToken,
};

function authenticate(req, res) {
    let user = req.swagger.params.authRequest.value;
    let authenticateUser = () => {
        return securityDao.authenticate(user.username, user.password)
        .then((userModel) => {
            if (userModel && userModel.length>0) {
                var user = {
                    id: userModel[0].id,
                    username: userModel[0].username,
                    firstName: userModel[0].firstName,
                    lastName: userModel[0].lastName,
                    emailId: userModel[0].emailId,
                    profilePicture: userModel[0].profilePicture,
                    roleId: userModel[0].roleId,
                    privileges: userModel[0].privileges, 
                    club: userModel[0].club, 
                }
            }
            let token = jwt.sign(user, config.security.secret, {
                expiresIn: TOKEN_EXPIRATION_TIME
            })
            return {
                token: token,
                expires: TOKEN_EXPIRATION_TIME,
                user: user
            };
        })
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, authenticateUser);
}

function validateToken(req, res) {
    let token = req.token;
    delete token.exp;
    delete token.iat;
    res.status(200).send(req.token);
}
