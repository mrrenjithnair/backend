const controllerUtils = require('../../controllerUtils.js');
const db = require('../../db/dbConnection.js'); //required for applying transaction
const auctionDao = require('../../dao/auctionDao');
const modelUtils = require('../../modelUtils.js');

module.exports = {
    insertOrUpdatePlayerAuction: insertOrUpdatePlayerAuction,
    getPlayerForAuction: getPlayerForAuction,
    insertOrUpdateAuction: insertOrUpdateAuction
};

function insertOrUpdatePlayerAuction(req, res) {
    let data = req.swagger.params.auctionPlayer.value;
    let insertOrUpdatePlayerAuction = () => {
        return auctionDao.insertOrUpdatePlayerAuction(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, insertOrUpdatePlayerAuction);
}

function getPlayerForAuction(req, res) {
    let clubId = req.swagger.params.clubId.value
    let tournamentId = req.swagger.params.tournamentId.value
    console.log(tournamentId,clubId)
    let data = { clubId: parseInt(clubId), tournamentId: parseInt(tournamentId) }
    let getPlayerForAuction = () => {
        return auctionDao.getPlayerForAuction(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getPlayerForAuction);
}

function insertOrUpdateAuction(req, res) {
    let data = req.swagger.params.auction.value;
    let insertOrUpdateAuction = () => {
        return auctionDao.insertOrUpdateAuction(data)
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, insertOrUpdateAuction);
}
