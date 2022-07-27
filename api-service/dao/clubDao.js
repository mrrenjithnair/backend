'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const clubDbModel = require('../model/club.js').club;
const userDbModel = require('../model/user.js').user;
const clubUserMappingDbModel = require('../model/club_user_mapping.js').club_user_mapping;
const clubPlayerMappingDbModel = require('../model/club_player_mapping.js').club_player_mapping;
const promise = require('bluebird');


const SELECT_SPORTS = " SELECT * FROM SPORTS  "

const EXISITING_CLUB = " SELECT * FROM CLUB C WHERE C.NAME = :name AND C.LOCATION = :location  "
const EXISITING_USER = " SELECT * FROM USER U WHERE U.EMAILID = :emailId AND U.USERNAME = :username "

const GET_CLUB_LIST = " SELECT C.*, CONCAT(U.FIRSTNAME, ' ', U.LASTNAME) ownerName, U.ID ownerId, CPM.playerId, CPM.approved FROM CLUB C  " +
    " INNER JOIN CLUB_USER_MAPPING CUM ON CUM.CLUBID = C.ID " +
    " INNER JOIN USER U ON U.ID = CUM.USERID " +
    " LEFT OUTER JOIN CLUB_PLAYER_MAPPING CPM ON CPM.CLUBID = C.ID AND CPM.PLAYERID = :userId" +
    " WHERE C.DELETEDAT IS NULL "

const GET_CLUB_LIST_ADMIN = " SELECT C.*, CONCAT(U.FIRSTNAME, ' ', U.LASTNAME) ownerName, U.ID ownerId FROM CLUB C  " +
    " INNER JOIN CLUB_USER_MAPPING CUM ON CUM.CLUBID = C.ID " +
    " INNER JOIN USER U ON U.ID = CUM.USERID " +
    " WHERE C.DELETEDAT IS NULL "

    
const GET_CLUB_ADMIN_LIST = " SELECT * FROM USER U " +
    " LEFT OUTER JOIN CLUB_USER_MAPPING CUM ON CUM.USERID = U.ID " +
    " WHERE U.ROLEID = 2 " 

const clubDao = new function () {
    this.insertOrUpdateClub = function (data) {
        if (data.id) {
            return this.updateClub(data)
        } else {
            return this.insertClub(data)
        }
    }
    this.insertClub = function (clubReq) {
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
        if(!clubReq.superAdmin && !clubReq.assigned){
            if (clubReq.approved) {
                query += "AND  CPM.PLAYERID = :userId AND  CPM.APPROVED = 1 "
            } else {
                query += " AND  CPM.APPROVED IS NULL  OR CPM.APPROVED = 0  "
            }
        }
        if (clubReq.assigned) {
            query += " AND CUM.USERID IS NULL "
        }
        query += "  group By c.id "
        return db.query(query, {
            replacements: clubReq,
            type: db.QueryTypes.SELECT
        }).then((club) => {
            return club
        })
    }
    this.getClubAdminList = function (clubReq) {
        let query = GET_CLUB_ADMIN_LIST
        if (clubReq.userId) {
            query += " AND U.ID = :userId "
        }
        if (!clubReq.superAdmin) {
            if (clubReq.assigned) {
                query += " AND CUM.CLUBID IS NOT NULL "
            }

        } else {
            query += "  GROUP BY U.ID "
        }
 
        return db.query(query, {
            replacements: clubReq,
            type: db.QueryTypes.SELECT
        }).then((adminLists) => {
            let query2 
            let adminArray = []
            if (adminLists && adminLists.length > 0 && clubReq.superAdmin) {
           return promise.mapSeries(adminLists, async (admin, i) => {
                    query2 = GET_CLUB_LIST_ADMIN
                    clubReq.ownerId = admin.id
                    query2 += " AND U.ID = :ownerId "
                    query2 += " GROUP BY C.ID "
                    db.query(query2, {
                        replacements: clubReq,
                        type: db.QueryTypes.SELECT
                    }).then((clubList) => {
                        admin.clubList = []
                        delete admin.password
                        if (clubList && clubList.length > 0) {
                            clubList.map((item) => {
                                admin.clubList.push({
                                    name: item.name,
                                    clubId: item.id,
                                    logo: item.logo
                                })
                            })
                            adminArray.push(admin)
                        }
                    })
                }).then((data)=>{
                    return adminArray
                })
            }else{
               return adminLists
            }
            
        })
    }
    this.getClubDetails = function (clubReq) {
        let query = GET_CLUB_LIST
        if(clubReq.userId){
            query += " AND  CPM.PLAYERID = :userId "
        }
        if(clubReq.clubId){
            query += " AND C.ID = :clubId "
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
                return clubUserMappingDbModel.create(obj)
            }).then((data) => {
                return userDetail
            })
    }
    this.joinClub = function (data) {
        let obj ={
            playerId :data.userId,
            clubId :data.clubId,
            approved: 0,
        }
        return clubPlayerMappingDbModel.create(obj).then((data) => {
            return data
        })
    }
    this.updateClub = function (userReq) {
        return clubDbModel.update(userReq, {
            where: {
                'id': userReq.id
            }
        }).then((savedUser) => {
            return savedUser.get();
        })
    }
}
module.exports = clubDao;