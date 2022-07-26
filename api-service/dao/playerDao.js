'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const userDbModel = require('../model/user.js').user;
const playerDbModel = require('../model/player.js').player;

const GET_PLAYER_LIST = " select u.id, C.ID clubId, u.firstName, u.lastName, u.mobile, u.dob, u.username, u.roleId, u.profilePicture, s.name sportName, s.type sportType, p.category, u.location, u.village, p.playerType, spm.approved, " +
    " u.roleId, u.emailId from user u " +
    " inner join player p on u.id = p.userId " +
    " inner join sports s on s.id = p.sportsTypeId " +
    " left outer join club_player_mapping spm on spm.playerId = u.id " +
    " left outer join club c on c.id = spm.clubId " +
    " left outer join tournament t on t.clubId = c.id " +
    " left outer join team te on te.tournamentId = t.id " +
    " left outer join team_player_mapping tpm on tpm.teamId = te.id " +
    " where u.roleId = 3 and u.deletedAt is null " 

const GET_PLAYER_TEAM_LIST = " SELECT T.NAME teamName, T.ID teamid, tpm.bidAmount, t.logo from user u " +
    " INNER JOIN team_player_mapping TPM ON TPM.userId = u.id " +
    " INNER JOIN team t ON TPM.teamId = t.id "  

const playerDao = new function () {
    this.getPlayerList = function (clubReq) {
        let query = GET_PLAYER_LIST
        if(clubReq.clubId){
            query += " and c.id = :clubId "
        }
        if(clubReq.teamId){
            query += " and te.id = :teamId "
        }
        if (clubReq.playerId) {
            query += " and u.id = :playerId "
        }
        if (clubReq.userId) {
            query += " and u.id = :userId "
        }
            query += " group by u.id "
        return db.query(query, {
            replacements: clubReq,
            type: db.QueryTypes.SELECT
        }).then((playerList) => {
            return playerList
        })
    }
    this.getTeamsList = function (clubReq) {
        let query = GET_PLAYER_TEAM_LIST
        if(clubReq.playerId){
            query += " and u.id = :playerId "
        }
        query += " group by t.id "
        return db.query(query, {
            replacements: clubReq,
            type: db.QueryTypes.SELECT
        }).then((teamList) => {
            return teamList
        })
    }
    


}
module.exports = playerDao;