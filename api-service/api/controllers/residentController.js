const controllerUtils = require('./../../controllerUtils.js');
const db = require('./../../db/dbConnection.js'); //required for applying transaction
const sportTypeDao = require('../../dao/sportType.js');
const modelUtils = require('./../../modelUtils.js');

module.exports = {
    getResidentDropdownValues: getResidentDropdownValues,
};

function getResidentDropdownValues(req, res) {
    let project_id = req.swagger.params.project_id.value;

    let getResidentDropdownValuesFromDao = () => {
        return sportTypeDao.getResidentDropdownValues(project_id);
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getResidentDropdownValuesFromDao);
}

