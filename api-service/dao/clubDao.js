'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const clubDbModel = require('../model/club.js').club;
const userDbModel = require('../model/user.js').user;
const clubUserMappingDbModel = require('../model/club_user_mapping.js').club_user_mapping;


const SELECT_SPORTS = " SELECT * FROM SPORTS  "

const EXISITING_CLUB = " SELECT * FROM CLUB C WHERE C.NAME = :name AND C.LOCATION = :location  "
const EXISITING_USER = " SELECT * FROM USER U WHERE U.EMAILID = :emailId AND U.USERNAME = :username "

const GET_CLUB_LIST = " SELECT C.*, CONCAT(U.FIRSTNAME, ' ', U.LASTNAME) ownerName, U.ID ownerId, CPM.playerId, CPM.approved FROM CLUB C  " +
    " LEFT OUTER JOIN CLUB_USER_MAPPING CUM ON CUM.CLUBID = C.ID " +
    " LEFT OUTER JOIN USER U ON U.ID = CUM.USERID " +
    " LEFT OUTER JOIN CLUB_PLAYER_MAPPING CPM ON CPM.CLUBID = C.ID "
const clubDao = new function () {
    this.insertOrUpdateClub = function (data) {
        if (data.id) {
            return {}
        } else {
            return this.insertClub(data)
        }
    }
    this.insertClub = function (clubReq) {
        console.log("clubReq",clubReq)
        let clubDetail
        return db.query(EXISITING_CLUB, {
            replacements: clubReq,
            type: db.QueryTypes.SELECT
        }).then((club) => {
            if (club && club.length > 0) {
                throw exceptionUtil.createSPException(config.club.clubAlreadyExists);
            }
        })
            .then((club) => {
                return clubDbModel.create(clubReq)
            }).then((savedclub) => {
                return savedclub.get();
            })
    }
    this.getClubList = function (clubReq) {
        let query = GET_CLUB_LIST
        if(clubReq.userId){
            query += " AND  CPM.PLAYERID = :userId "
        }
        return db.query(query, {
            replacements: clubReq,
            type: db.QueryTypes.SELECT
        }).then((club) => {
            return club
        })
    }
    this.clubAdminInsertOrUpdate = function (data) {
        if (data.id) {
            return {}
        } else {
            return this.insertAdmin(data)
        }
    }
    this.insertAdmin = function (userReq) {
        let userDetail
        return db.query(EXISITING_USER, {
            replacements: userReq,
            type: db.QueryTypes.SELECT
        }).then((user) => {

            if (user && user.length > 0) {
                return userDbModel.findOne({
                    where: {
                        'emailId': userReq.emailId
                    }
                }).then((u) => {
                    if (u)
                        throw exceptionUtil.createSPException(config.user.emailIdAlreadyExists);
                    else
                        throw exceptionUtil.createSPException(config.user.usernameAlreadyExists);
                });
            }
        })
            .then((user) => {
                userReq.roleId = 2
                return userDbModel.create(userReq)
            }).then((savedUser) => {
                return savedUser.get();
            }).then((savedUser) => {
                userDetail = savedUser
                let obj ={
                    userId :savedUser.id,
                    clubId :userReq.clubId,
                    approved: 1,
                }
                console.log('obj',obj)
                return clubUserMappingDbModel.create(obj)
            }).then((data) => {
                return userDetail
            })
    }
}
module.exports = clubDao;