'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const tournamentDbModel = require('../model/tournament.js').tournament;
const teamDbModel = require('../model/team.js').team;


const GET_TOURNAMENT_LIST = " SELECT * FROM TOURNAMENT T WHERE T.DELETEDAT IS NULL "

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
            if(tournamentReq.teamTotal){
                let teamTotal = parseInt(tournamentReq.teamTotal)
                for (let i = 0; i < teamTotal; i++) {
                    let obj = {
                        name: 'team ' + (i + 1),
                        clubId: tournamentReq.clubId
                    }
                    teamDbModel.create(obj)
                }
            }
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
        let query = GET_TOURNAMENT_LIST
        if (tournamentReq.tournamentId) {
            query += " AND  T.ID = :tournamentId "
        }
        return db.query(query, {
            replacements: tournamentReq,
            type: db.QueryTypes.SELECT
        }).then((tournament) => {
            return tournament
        })
    }

}
module.exports = tournamentDao;