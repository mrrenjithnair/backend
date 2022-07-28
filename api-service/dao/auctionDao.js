'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const clubDbModel = require('../model/club.js').club;
const userDbModel = require('../model/user.js').user;
const teamPlayerMappinggDbModel = require('../model/team_player_mapping.js').team_player_mapping;
const auctionDbModel = require('../model/auction.js').auction;
const promise = require('bluebird');

const SELECT_USER = " select concat(u.firstname, ' ', u.lastname) playerName, u.id playerId, " +
    " r.id, p.playerType, p.category, u.profilePicture, u.location, u.village, u.bio, r.tournamentId  from request r " +
    " inner join club c on c.id = r.clubId " +
    " inner join tournament t on t.id = r.tournamentId " +
    " inner join user u on u.id = r.userId " +
    " inner join player p on p.userid = u.id " +
    " where r.approved = 1 and r.assigned = 0 and r.tournamentId =:tournamentId  "


const UPDATE_REQUEST = " UPDATE request r SET r.assigned = 1 WHERE r.id =:requestId "
const COMPLETE_AUCTION = " UPDATE request SET assigned = 1 WHERE ID =:requestId "

const auctionDao = new function () {
    this.getPlayerForAuction = function (clubReq) {

        return db.query(SELECT_USER, {
            replacements: clubReq,
            type: db.QueryTypes.SELECT
        }).then((user) => {
            return user
        })
    }
    this.insertOrUpdatePlayerAuction = function (data) {
        return db.query(UPDATE_REQUEST, {
            replacements: data,
            type: db.QueryTypes.UPDATE
        }).then((user) => {
            let body = { userId: data.playerUserId, teamId: data.teamId, bidAmount: data.bidAmount }
            return teamPlayerMappinggDbModel.create(body).then((result) => {
                return result.get();
            })
        })

    }
    this.insertOrUpdateAuction = function (data) {
        if (data.id) {
            return auctionDbModel.update(data, {
                where: {
                    'id': data.id
                }
            }).then((auction) => {
                return auction
            })
        } else {
            return auctionDbModel.create(data).then((auction) => {
                return auction
            })
        }

    }
}

module.exports = auctionDao;