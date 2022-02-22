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
};

function authenticate(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    let user = req.swagger.params.authRequest.value;
    let webapp = user.webapp ? user.webapp : false
    let authenticateUser = () => {
        return securityDao.authenticate(user.username, user.password, req.headers.secret, req.headers.deviceid, webapp )
        .then((userModel) => {
            //Keep only the necessary items in token object
            if (userModel && userModel.length>0) {
                var user = {
                    id: userModel[0].id,
                    username: userModel[0].username,
                    firstName: userModel[0].firstName,
                    lastName: userModel[0].lastName,
                    emailId: userModel[0].emailId,
                }
            }
            // if user is found and password is right, create a token
            let token = jwt.sign(user, config.security.secret, {
                expiresIn: TOKEN_EXPIRATION_TIME
            })
            console.log('token',token)

            return {
                token: token,
                expires: TOKEN_EXPIRATION_TIME,
                user: user
            };
        })
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, authenticateUser);
}


