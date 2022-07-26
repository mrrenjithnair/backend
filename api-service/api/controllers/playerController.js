const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const playerDao = require('../../dao/playerDao.js');
const userDao = require('../../dao/userDao.js');
const modelUtils = require('../../modelUtils.js');

module.exports = {
    getPlayerList: getPlayerList,
    insertOrUpdatePlayer: insertOrUpdatePlayer,
    getTeamsList: getTeamsList,

};


function getPlayerList(req, res) {
    let clubId = req.swagger.params.clubId.value;
    let teamId = req.swagger.params.teamId.value;
    let userId = req.swagger.params.userId.value
    let playerId = req.swagger.params.playerId.value

    clubId = clubId ? parseInt(clubId): null
    teamId = teamId ? parseInt(teamId): null
    userId = userId ? parseInt(userId): null
    playerId = playerId ? parseInt(playerId): null
    
    let obj = { clubId, teamId, userId, playerId }
    let getPlayerListFromDao = () => {
        if (playerId) {
            return playerDao.getPlayerList(obj)
        } else {
            return userDao.getUserDetail(obj)
        }
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
function getTeamsList(req, res) {
    let playerId = req.swagger.params.playerId.value;
    let getTeamsListFromDao = () => {
        return playerDao.getTeamsList({playerId})
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getTeamsListFromDao);

}




