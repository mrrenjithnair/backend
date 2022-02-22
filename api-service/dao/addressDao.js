const exceptionUtil = require('./../exceptionUtils.js');
const db = require('./../db/dbConnection.js').get();
const config = require('./../config.js').getMessageConfig();
const addressDbModel = require('../model/address_dts.js').address_dts;

const addressDao = new function () {

    this.insertResidentAddress = function (inputJson) {
        return addressDbModel.create(inputJson).
            then((savedAddress) => {
                return savedAddress.get();
            });
    }

    this.updateResidentAddress = function (inputJson) { //id, unit
        return addressDbModel.findOne({
            where: {
                'entity_id': inputJson.entity_id,
                'unit_id': inputJson.unit_id,
            }
        }).then((addressDetails) => {
            if (!addressDetails)
                return this.insertResidentAddress(inputJson);

            return addressDetails.update(inputJson).
                then((savedAddress) => {
                    return savedAddress.get();
                });
        });
    }
}

module.exports = addressDao