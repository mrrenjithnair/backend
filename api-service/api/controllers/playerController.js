const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const playerDao = require('../../dao/playerDao.js');
const userDao = require('../../dao/userDao.js');
const modelUtils = require('../../modelUtils.js');

module.exports = {
    getPlayerList: getPlayerList,
    insertOrUpdatePlayer: insertOrUpdatePlayer,

};


function getPlayerList(req, res) {
    let clubId = req.swagger.params.clubId.value;
    let teamId = req.swagger.params.teamId.value;
    clubId = clubId ? parseInt(clubId): null
    teamId = teamId ? parseInt(teamId): null
    
    let obj ={clubId,teamId}
    let getPlayerListFromDao = () => {
        return playerDao.getPlayerList(obj)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getPlayerListFromDao);

}

function insertOrUpdatePlayer(req, res) {
    let data = req.swagger.params.player.value;
    let insertOrUpdatePlayerFromDao = () => {
        return userDao.insertOrUpdatePlayer(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, insertOrUpdatePlayerFromDao);

}



