'use strict';

const exceptionUtils = require('./exceptionUtils.js');
// const logUtils = require('nww-core-models/utils/logUtils.js');
const modelUtils = require('./modelUtils.js');
// const logger = require('nww-core-models/utils/logUtils.js').logger;
const config = require('./config.js').getMessageConfig();

const controllerUtils = new function() {
    this.handleSuccess = function(res) {
        res.status(200).send(this.createSuccessMessage(config.global));
    }

    this.handleGatewaySuccess = function(req, res, data) {
        res.status(200).send(data);
    }

    this.handleError = function(req, res, err, filepath = null) {
        // logger.error(err);
        // if (filepath)
        //     logger.error(err, logUtils.getLogData(req, filepath));
        var exception = exceptionUtils.handleException(err);
        var httpErrorCode = (exception.httpErrorCode) ? exception.httpErrorCode : 500;
        res.status(httpErrorCode).send(exception);
    }

    this.applyTxAndHandleSimpleResponse = function(db, req, res, filename, txFunction, arg) {
        return db.applyTx(txFunction, arg)
            .then(() => { //commit and send 200 reponse
                this.handleSuccess(res);
            }).catch((err) => { //rollback and send failure response
                // logger.error(err);
                this.handleError(req, res, err, filename);
            });
    }

    this.applyTxAndHandleModelResponse = function(db, req, res, filename, txFunction, arg) {
        return db.applyTx(txFunction, arg)
            .then((model) => { //commit and send 200 reponse
                modelUtils.restifyModel(model);
                res.json(model);
                return model;
            }).catch((err) => { //rollback and send failure response
                // logger.error(err);
                this.handleError(req, res, err, filename);
            });
    }

    this.applyTx = function(db, txFunction, arg) {
        return db.applyTx(txFunction, arg);
    }

    this.createSuccessMessage = function(configObject) {
        return {
            message: configObject.message
        };
    }
};

module.exports = controllerUtils;
