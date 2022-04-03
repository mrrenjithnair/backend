'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const requestDbModel = require('../model/request.js').request;


const requestDao = new function () {
    this.insertOrUpdateRequest = function (data) {
        if (data.id) {
            return this.updateRequest(data)
        } else {
            return this.insertRequest(data)
        }
    }
    this.insertRequest = function (requestObj) {
        return requestDbModel.create(requestObj)
            .then((requestDetails) => {
                return requestDetails.get();
            })
    }
    this.updateRequest = function (requestObj) {
        return requestDbModel.update(requestObj, {
            where: {
                'id': requestObj.id
            }
        }).then((requestDetails) => {
            return requestDetails.get();
        })
    }
}
module.exports = requestDao;