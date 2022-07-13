'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const tournamentDbModel = require('../model/tournament.js').tournament;
const teamDbModel = require('../model/team.js').team;


const GET_TOURNAMENT_LIST =  " SELECT t.*,  " +
    " CASE WHEN R.TYPE='team' THEN 1 ELSE 0 END requestedTeam, " +
    " CASE WHEN R.TYPE='tournament' THEN 1 ELSE 0 END requestedTournament " +
    " FROM TOURNAMENT T " +
    " INNER JOIN CLUB_PLAYER_MAPPING CPM ON CPM.CLUBID = T.CLUBID AND CPM.APPROVED = 1 " +
    " INNER JOIN USER U ON U.ID = CPM.PLAYERID " +
    " LEFT OUTER JOIN REQUEST R ON R.TOURNAMENTID= T.ID AND R.USERID = U.ID" +
    " WHERE T.DELETEDAT IS NULL" 

const GET_MY_TOURNAMENT_LIST = " SELECT * FROM TOURNAMENT T  " +
    " INNER JOIN TEAM TM ON TM.TOURNAMENTID = T.ID " +
    " INNER JOIN TEAM_PLAYER_MAPPING TPM ON TPM.TEAM_ID  = TM.ID " +
    " WHERE T.DELETEDAT IS NULL  " 


const GET_TOURNAMENT_DETAIL =  " SELECT T.ID tournamentId, T.NAME name, T.LOGO logo, T.STARTDATE startDate, T.ENDDATE endDate, T.TEAMTOTAL teamTotal, T.MEMBERTOTAL memberTotal, T.CLUBID clubId " +
    " FROM TOURNAMENT T " +
    " INNER JOIN CLUB C ON C.ID = T.CLUBID" +
    " WHERE T.ID = :tournamentId " 

const GET_TOURNAMENT_TEAM_DETAIL = " SELECT TE.NAME teamName, CONCAT(U.FIRSTNAME, ' ', U.LASTNAME) ownerName, TE.LOGO teamLogo, TE.OWNERID ownerId FROM TEAM TE " +
    " INNER JOIN TOURNAMENT T ON T.ID = TE.TOURNAMENTID  " +
    " INNER JOIN USER U ON U.ID = TE.OWNERID  " +
    " where t.deletedat is null " +
    " and TE.TOURNAMENTID = :tournamentId " 

const tournamentDao = new function () {
    this.insertOrUpdateTournament = function (data) {
        if (data.id) {
            return this.updateTournament(data)
        } else {
            return this.insertTournament(data)
        }
    }
    this.insertTournament = function (tournamentReq) {
        return tournamentDbModel.findOne({
            where: {
                'name': tournamentReq.name,
                'clubId': tournamentReq.clubId
            }
        }).then((u) => {
            if (u)
                throw exceptionUtil.createSPException(config.tournament.tournamentAlreadyExists);
        }).then(() => {
            return tournamentDbModel.create(tournamentReq)
        }).then((savedTournament) => {
            return savedTournament.get();
        }).then((data) => {
            // if(tournamentReq.teamTotal){
            //     let teamTotal = parseInt(tournamentReq.teamTotal)
            //     for (let i = 0; i < teamTotal; i++) {
            //         let obj = {
            //             name: 'team ' + (i + 1),
            //             clubId: tournamentReq.clubId
            //         }
            //         teamDbModel.create(obj)
            //     }
            // }
            return data
        })
    }
    this.updateTournament = function (tournamentReq) {
        return tournamentDbModel.update(tournamentReq, {
            where: {
                'id': tournamentReq.id
            }
        }).then((savedTournament) => {
            return savedTournament
        })
    }
    this.getTournamentList = function (tournamentReq) {
        let query
        if (tournamentReq.list == false) {
            query = GET_MY_TOURNAMENT_LIST
        } else {
            query = GET_TOURNAMENT_LIST
            if(tournamentReq.cluAdmin == false){
                query += " AND CPM.playerId = :userId"

            }
            if(tournamentReq.cluAdmin == false && tournamentReq.list == false ){
                query += " AND r.userId = :userId "
            }
        }
        if (tournamentReq.tournamentId) {
            query += " AND  T.ID = :tournamentId "
        }
        if (tournamentReq.clubId) {
            query += " AND  T.CLUBID = :clubId "
        }
        
        query += " GROUP BY T.ID "
        return db.query(query, {
            replacements: tournamentReq,
            type: db.QueryTypes.SELECT,
            // logging: console.log,
        }).then((tournament) => {
            return tournament
        })
    }
    this.getTournamentDetails = function (tournamentReq) {
        let query = GET_TOURNAMENT_DETAIL
        return db.query(query, {
            replacements: tournamentReq,
            type: db.QueryTypes.SELECT,
            // logging: console.log,
        }).then((tournament) => {
            return db.query(GET_TOURNAMENT_TEAM_DETAIL, {
                replacements: tournamentReq,
                type: db.QueryTypes.SELECT,
                // logging: console.log,
            }).then((team)=>{
                tournament[0].teams = team
                return tournament
            })
        }).then((tournament) => {
            return tournament
        })
    }

}
module.exports = tournamentDao;