'use strict';

module.exports = DVException;

function DVException(message, errorCode, httpErrorCode) {
    this.message = message;
    this.errorCode = errorCode;
    this.httpErrorCode = httpErrorCode;
}
