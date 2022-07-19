const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const auctionDao = require('../../dao/auctionDao');
const modelUtils = require('../../modelUtils.js');

module.exports = {
    insertOrUpdateAuction: insertOrUpdateAuction,
    getPlayerForAuction: getPlayerForAuction,
};

function insertOrUpdatePlayer(req, res) {
    let data = req.swagger.params.player.value;
    let insertOrUpdateAuction = () => {
        return auctionDao.insertOrUpdateAuction(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, insertOrUpdateAuction);
}

function getPlayerForAuction(req, res) {
    let data = req.swagger.params.clubId
    
    .value;
    let getPlayerForAuction = () => {
        return auctionDao.getPlayerForAuction(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getPlayerForAuction);
}

