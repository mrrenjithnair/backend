'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const userDbModel = require('../model/user.js').user;
const playerDbModel = require('../model/player.js').player;

const GET_PLAYER_LIST = " select u.firstName, u.lastName, u.dob, u.username, u.roleId, u.profilePicture, s.name sportName, s.type sportType, p.category from user u " +
    " inner join player p on u.id = p.userId " +
    " inner join sports s on s.id = p.sportsTypeId " +
    " left outer join club_player_mapping spm on spm.playerId = u.id " +
    " left outer join club c on c.id = spm.clubId " +
    " where u.roleId = 3 and u.deletedAt is null " 

const playerDao = new function () {
    this.getPlayerList = function (clubReq) {
        let query = GET_PLAYER_LIST
        if(clubReq.clubId){
            query += " and c.id = :clubId "
        }
        return db.query(query, {
            replacements: clubReq,
            type: db.QueryTypes.SELECT
        }).then((playerList) => {
            return playerList
        })
    }

}
module.exports = playerDao;