const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const entityUnitMappingDbModel = require('../model/entity_unit_mapping.js').entity_unit_mapping;

/* const SLECT_UNIT_DETAILS_BY_PROJECT_ID = " SELECT UD.UNIT_ID, UD.FLOOR_ID, UD.PROJECT_ID, UD.DESCRIPTION " +
    " FROM UNIT_DTS UD " +
    " WHERE UD.PROJECT_ID = :project_id AND UD.UNIT_NO = :unit_id "; */

const entityUnitMappingDao = new function () {
    /* this.getUnitDetails = function (inputJson) {
        let queryReplacement = {
            project_id: inputJson.project_id,
            unit_id: inputJson.unit_id,
        }
        return db.query(SLECT_UNIT_DETAILS_BY_PROJECT_ID, {
            replacements: queryReplacement,
            type: db.QueryTypes.SELECT
        }).then((unitDetails) => {
            if (!unitDetails || unitDetails.length == 0)
                throw exceptionUtil.createDVException(config.residentType.residentTypeNotFound);
            return unitDetails;
        });
    } */

    this.insertEntityUnitMapping = function (inputJson) {
        return entityUnitMappingDbModel.create(inputJson).
            then((savedUnit) => {
                return savedUnit.get();
            });
    }

    this.updateEntityUnitMapping = function (inputJson) { //id, unit
        return entityUnitMappingDbModel.findOne({
            where: {
                'unit_mapping_id': inputJson.unit_mapping_id
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
module.exports = entityUnitMappingDao;