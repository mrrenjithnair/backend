const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const clubDao = require('../../dao/clubDao.js');
const modelUtils = require('../../modelUtils.js');

module.exports = {
    insertOrUpdateClub: insertOrUpdateClub,
    getClubList: getClubList,
    clubAdminInsertOrUpdate: clubAdminInsertOrUpdate,
};

function insertOrUpdateClub(req, res) {
    let data = req.swagger.params.club.value;
    let insertOrUpdateClubFromDao = () => {
        return clubDao.insertOrUpdateClub(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, insertOrUpdateClubFromDao);

}
function getClubList(req, res) {
    
    let userId = req.swagger.params.userId.value;
    let clubId = req.swagger.params.clubId.value;
    let obj={userId,clubId}
    let getClubListFromDao = () => {
        if (obj.clubId) {
            return clubDao.getClubDetails(obj)
        } else {
            return clubDao.getClubList(obj)
        }
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getClubListFromDao);

}
function clubAdminInsertOrUpdate(req, res) {
    let data = req.swagger.params.clubAdmin.value;
    let clubAdminInsertOrUpdateFromDao = () => {
        return clubDao.clubAdminInsertOrUpdate(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, clubAdminInsertOrUpdateFromDao);

}



