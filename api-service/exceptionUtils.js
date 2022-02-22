'use strict';

const _ = require('lodash');

const DVException = require('./DVException.js');
const config = require('./config.js').getMessageConfig();

const exceptionUtils = new function() {
    this.createDVException = function(configObject, addedMessage = false) {
        var message = configObject.message + (addedMessage? ' ' + addedMessage : '')
        var errorCode = configObject.errorCode;
        var httpErrorCode = configObject.httpErrorCode;
        return new DVException(message, errorCode, httpErrorCode);
    }

    this.handleException = function(err) {
        var httpErrorCode = this.getHttpErrorCode(err);
        if (err.httpErrorCode)
            return this.createDVException(err); //This is to remove transaction context log

        return this.handleNonHttpException(err);
    }

    this.handleNonHttpException = function(err) {
        var exObject = null;
        exObject = this.handleDBException(err);
        if (exObject != null)
            return exObject;
        return this.createHTTPInternalException(err);
    }

    this.handleDBException = function(err) {
        switch (err.name) {
            case 'SequelizeUniqueConstraintError':
                return this.handleUniqueConstraintError(err);
                break;
            case 'SequelizeValidationError':
                return this.handleSequelizeValidationError(err);
                break;
            default:
                return null;
        }
    }

    this.handleSequelizeValidationError = function(err) {
        var validationMessages = [];
        _.each(err.errors, function(value) {
            validationMessages.push(value.message);
        });

        if (validationMessages.length != 0) {
            var validationConfig = config.global.sequelizeValidation;
            return new DVException(validationMessages, validationConfig.errorCode, validationConfig.httpErrorCode);
        }
    }

    this.handleUniqueConstraintError = function(err) {
        var validationMessages = [];
        var validationConfig = config.global.uniqueValidation;
        _.each(err.errors, function(value) {
            var dbMessage = value.path;
            if (dbMessage.startsWith('uc_'))
                dbMessage = dbMessage.substring(3).replace('_', ' ');
            if (dbMessage == 'PRIMARY')
                dbMessage = 'Record';
            var errorMessage = dbMessage + ' ' + validationConfig.message;
            validationMessages.push(errorMessage);
        });

        if (validationMessages.length != 0) {
            return new DVException(validationMessages, validationConfig.errorCode, validationConfig.httpErrorCode);
        }
    }

    this.createHTTPInternalException = function(err) {
        var message = err.message;
        var errorCode = err.errorCode;
        if (!message)
            message = config.global.internalError.message;
        if (!errorCode)
            errorCode = config.global.internalError.errorCode;

        return new DVException(message, errorCode, 500);
    }

    this.getHttpErrorCode = function(err) {
        if (err.httpErrorCode)
            return err.httpErrorCode
        return 500;
    }

};

module.exports = exceptionUtils;
