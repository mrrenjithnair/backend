'use strict'

const crypto = require('crypto');
const isString = require('lodash/isString');
const isEmpty = require('lodash/isEmpty');
const isNil = require('lodash/isNil');
const isNumber = require('lodash/isNumber');
const coreModelSystemConfig = require('./modelConfig.js').getSystemConfig();

const modelUtils = new function() {

    this.restifyModel = (model) => {
        delete model.entry_by;
        delete model.updated_by;
        delete model.entry_dt;
        delete model.updated_dt;
        delete model.lastupdated_dt;
        delete model.deletedAt;
    }

    this.copyProperties = (source, target) => {
        for (var k in source) target[k] = source[k];
    }

    this.trimAllProperties = (source) => {
        for (var k in source) {
            if (isString(source[k])) {
                source[k] = source[k].trim();
            }
        }
    }

    this.isPaginationInputEmpty = (pageNumber, pageSize) => {
        if (isNumber(pageNumber) && isNumber(pageSize)) {
            return pageNumber <= 0 || pageSize <= 0;
        }
        return true;
    }

    this.decryptBlob = (value, key = coreModelSystemConfig.db.blobEncryptionKey) => {
        if (isEmpty(value))
            return null;
        let _algorithm = 'aes-256-cbc';
        let _iv_length = 16;
        //let key = coreModelSystemConfig.db.blobEncryptionKey;
        key = new Buffer(key, 'hex');
        var previous = new Buffer(value, 'binary');
        if (!previous) {
            return {};
        }

        previous = new Buffer(previous);
        var iv = previous.slice(0, _iv_length);
        var content = previous.slice(_iv_length, previous.length);
        var decipher = crypto.createDecipheriv(_algorithm, key, iv);
        var json = decipher.update(content, undefined, 'utf8') + decipher.final('utf8');
        return JSON.parse(json);
    }
 




};

module.exports = modelUtils;
