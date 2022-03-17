const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const clubDao = require('../../dao/clubDao.js');
const modelUtils = require('../../modelUtils.js');

module.exports = {
    insertOrUpdateClub: insertOrUpdateClub,
    getClubList: getClubList,
    clubAdminInsertOrUpdate: clubAdminInsertOrUpdate,
    joinClubOrApprove: joinClubOrApprove,
    getClubAdminList: getClubAdminList,

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
    let approved = req.swagger.params.approved.value;
    let superAdmin = req.swagger.params.superAdmin.value  == 'true' ? true : false;
    let assigned = req.swagger.params.assigned.value  == 'true' ? true : false;
    
    
    let obj={userId,clubId,approved, superAdmin, assigned}
    let getClubListFromDao = () => {
        if (obj.clubId) {
            return clubDao.getClubDetails(obj)
        } else {
            return clubDao.getClubList(obj)
        }
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getClubListFromDao);

}

function getClubAdminList(req, res) {
    let userId = req.swagger.params.userId.value;
    let clubId = req.swagger.params.clubId.value;
    let assigned = req.swagger.params.assigned.value;
    let superAdmin = req.swagger.params.superAdmin.value;
    assigned = assigned ? req.swagger.params.assigned.value == 'true' ? true : false : false
    superAdmin = superAdmin ? req.swagger.params.superAdmin.value == 'true' ? true : false : false
    let obj = { userId, clubId, assigned, superAdmin }
    let getClubAdminListFromDao = () => {
        if (obj.userId) {
            return clubDao.getClubDetails(obj)
        } else {
            return clubDao.getClubAdminList(obj)
        }
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getClubAdminListFromDao);

}


function clubAdminInsertOrUpdate(req, res) {
    let data = req.swagger.params.clubAdmin.value;
    let clubAdminInsertOrUpdateFromDao = () => {
        return clubDao.clubAdminInsertOrUpdate(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, clubAdminInsertOrUpdateFromDao);

}

function joinClubOrApprove(req, res) {
    let clubObj = req.swagger.params.clubObj.value;
    let joinClubFromDao = () => {
        return clubDao.joinClub(clubObj)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, joinClubFromDao);

}



