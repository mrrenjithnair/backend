'use strict'

const crypto = require('crypto');
const isString = require('lodash/isString');
const isEmpty = require('lodash/isEmpty');
const isNil = require('lodash/isNil');
const isNumber = require('lodash/isNumber');


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


 




};

module.exports = modelUtils;
