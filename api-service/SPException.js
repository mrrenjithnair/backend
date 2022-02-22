'use strict';

module.exports = SPException;

function SPException(message, errorCode, httpErrorCode) {
    this.message = message;
    this.errorCode = errorCode;
    this.httpErrorCode = httpErrorCode;
}
