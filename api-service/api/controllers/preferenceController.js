const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const sportTypeDao = require('../../dao/sportType.js');
const modelUtils = require('../../modelUtils.js');

module.exports = {
    getPreferenceValues: getPreferenceValues,
};

function getPreferenceValues(req, res) {
    let project_id = req.swagger.params.project_id.value;

    let getPreferenceValuesFromDao = () => {
        console.log('renjith')
        return sportTypeDao.getPreferenceValues(project_id);
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getPreferenceValuesFromDao);
}

