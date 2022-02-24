const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const userDao = require('../../dao/userDao.js');
const modelUtils = require('../../modelUtils.js');

module.exports = {
    insertOrUpdatePlayer: insertOrUpdatePlayer,
};

function insertOrUpdatePlayer(req, res) {
    let data = req.swagger.params.player.value;
    let insertOrUpdatePlayerFromDao = () => {
        return userDao.insertOrUpdatePlayer(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, insertOrUpdatePlayerFromDao);

}

