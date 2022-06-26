'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const requestDbModel = require('../model/request.js').request;

const CLUB_REQUEST_LIST = " SELECT RQ.id, rq.approved, C.NAME clubName, C.ID clubId, T.ID tournamentId, T.NAME tournamentName, " +
    " T.LOGO logo, T.STARTDATE startDate, T.ENDDATE endDate, T.TEAMTOTAL teamTotal, T.MEMBERTOTAL memberTotal, CONCAT(U.FIRSTNAME, ' ', U.LASTNAME) playerName, RQ.TYPE type, UNIX_TIMESTAMP(RQ.CREATEDAT) * 1000 createdAt " +
    " FROM REQUEST RQ " +
    " INNER JOIN CLUB C ON C.ID = RQ.CLUBID " +
    " INNER JOIN TOURNAMENT T ON T.ID = RQ.TOURNAMENTID " +
    " INNER JOIN USER U ON U.ID = RQ.USERID "  +
    " WHERE U.DELETEDAT IS NULL AND T.DELETEDAT IS NULL "

const requestDao = new function () {
    this.insertOrUpdateRequest = function (data) {
        if (data.id) {
            return this.updateRequest(data)
        } else {
            return this.insertRequest(data)
        }
    }
    this.getClubRequest = function (queryReplacement) {
        let query = CLUB_REQUEST_LIST
        if (queryReplacement.clubId) {
            query += " AND C.Id = :clubId "
        }
        return db.query(query, {
            replacements: queryReplacement,
            type: db.QueryTypes.SELECT,
            logging: console.log,
        }).then((req) => {
            if (req && req.length > 0) {
                return req

            } else {
                return {}

            }
        })
    }
    this.insertRequest = function (requestObj) {
        return requestDbModel.create(requestObj)
            .then((requestDetails) => {
                return requestDetails.get();
            })
    }
    this.updateRequest = function (requestObj) {
        console.log(requestObj)

        return requestDbModel.update(requestObj, {
            where: {
                'id': requestObj.id
            }
        }).then((requestDetails) => {
            console.log(requestDetails)
            return requestDetails;
        })
    }
}
module.exports = requestDao;