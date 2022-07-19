'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const clubDbModel = require('../model/club.js').club;
const userDbModel = require('../model/user.js').user;
const clubUserMappingDbModel = require('../model/club_user_mapping.js').club_user_mapping;
const clubPlayerMappingDbModel = require('../model/club_player_mapping.js').club_player_mapping;
const promise = require('bluebird');

const SELECT_USER = " select concat(u.firstname, ' ', u.lastname) playerName, u.id playerId, " +
    " t.id, p.playerType, p.category, u.profilePicture, u.location, u.village, u.bio, r.tournamentId  from request r " +
    " inner join club c on c.id = r.clubId " +
    " inner join tournament t on t.id = r.tournamentId " +
    " inner join user u on u.id = r.userId " +
    " inner join player p on p.userid = u.id " +
    " where r.approved = 1 and r.assigned = 0  " 
const auctionDao = new function () {
    this.getPlayerForAuction = function (clubReq) {

        return db.query(SELECT_USER, {
            replacements: clubReq,
            type: db.QueryTypes.SELECT
        }).then((user) => {
            return user
        })
    }
    this.insertOrUpdateAuction = function(data){
        console.log(data)

    }
}

module.exports = auctionDao;