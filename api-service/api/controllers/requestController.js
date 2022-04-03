const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const requestDao = require('../../dao/requestDao.js');
const modelUtils = require('../../modelUtils.js');

module.exports = {
    insertOrUpdateRequest: insertOrUpdateRequest,

};

function insertOrUpdateRequest(req, res) {
    let data = req.swagger.params.request.value;
    let insertOrUpdateRequestFromDao = () => {
        return requestDao.insertOrUpdateRequest(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, insertOrUpdateRequestFromDao);

}

