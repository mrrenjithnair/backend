const exceptionUtil = require('./../exceptionUtils.js');
const db = require('./../db/dbConnection.js').get();
const config = require('./../config.js').getMessageConfig();
const unitDbModel = require('../model/unit_dts.js').unit_dts;

const SLECT_UNIT_DETAILS_BY_PROJECT_ID = " SELECT UD.UNIT_ID, UD.FLOOR_ID, UD.PROJECT_ID, UD.DESCRIPTION " +
    " FROM UNIT_DTS UD " +
    " WHERE UD.PROJECT_ID = :project_id AND UD.UNIT_NO = :unit_no ";

const unitDao = new function () {
    this.insertOrUpdateUnit = function (inputJson) {
        let queryReplacement = {
            project_id: inputJson.project_id,
            unit_no: inputJson.unit_no,
        }
        let query = SLECT_UNIT_DETAILS_BY_PROJECT_ID;
        if (inputJson.wing_id) {
            query += " AND UD.WING_ID = :wing_id ";
            queryReplacement.wing_id = inputJson.wing_id
        }
        return db.query(query, {
            replacements: queryReplacement,
            type: db.QueryTypes.SELECT
        }).then((unitDetails) => {
            if (!unitDetails || unitDetails.length == 0)
                return this.insertUnit(inputJson);
            else {
                inputJson.unit_id = unitDetails[0].UNIT_ID;
                return this.updateUnit(inputJson);
            }
        });
    }

    this.insertUnit = function (inputJson) {
        return unitDbModel.create(inputJson).
            then((savedUnit) => {
                return savedUnit.get();
            });
    }

    this.updateUnit = function (inputJson) { //id, unit
        return unitDbModel.findOne({
            where: {
                'unit_id': inputJson.unit_id
            }
        }).then((unit) => {
            if (!unit)
                throw exceptionUtil.createNWWException(config.unit.unitNotFound);

            return unit.update(inputJson).
                then((savedUnit) => {
                    return savedUnit.get();
                });
        });
    }


}
module.exports = unitDao;