const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const tournamentDao = require('../../dao/tournamentDao.js');
const modelUtils = require('../../modelUtils.js');

module.exports = {
    insertOrUpdateTournament: insertOrUpdateTournament,
    getTournament:getTournament
};

function insertOrUpdateTournament(req, res) {
    let data = req.swagger.params.tournament.value;
    let insertOrUpdateTournamentFromDao = () => {
        return tournamentDao.insertOrUpdateTournament(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, insertOrUpdateTournamentFromDao);

}


function getTournament(req, res) {
    
    let userId = req.swagger.params.userId.value;
    let clubId = req.swagger.params.clubId.value;
    let tournamentId = req.swagger.params.tournamentId.value;
    let list = req.swagger.params.list.value  == 'true' ? true : false;;
    let cluAdmin = req.swagger.params.cluAdmin.value  == 'true' ? true : false;;
    
    
    let obj = { userId, clubId, tournamentId, list, cluAdmin }
    let getTournamentListFromDao = () => {
        if (obj.tournamentId) {
            return tournamentDao.getTournamentDetails(obj)
        } else {
            return tournamentDao.getTournamentList(obj)
        }
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getTournamentListFromDao);

}
