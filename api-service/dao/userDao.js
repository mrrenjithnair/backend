'use strict';

const e = require('cors');
const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const userDbModel = require('../model/user.js').user;
const playerDbModel = require('../model/player.js').player;


const SELECT_SPORTS = " SELECT * FROM SPORTS  "

const EXISITING_USER = " SELECT * FROM USER U WHERE U.EMAILID = :emailId AND U.USERNAME = :username "
const USER_DETAILS = " SELECT * FROM USER U WHERE U.id = :userId "
const APPROVE_STATUS = " UPDATE CLUB_PLAYER_MAPPING SET approved = :approved WHERE PLAYERID = :userId AND CLUBID = :clubId "
const CLUB_LIST = " SELECT c.* FROM CLUB C " +
    " INNER JOIN CLUB_USER_MAPPING CUM ON CUM.CLUBID = C.ID " +
    " INNER JOIN USER U ON U.ID = CUM.USERID " +
    " WHERE U.DELETEDAT IS NULL " ;

const CLUB_LIST_PLAYER = " SELECT c.* FROM CLUB C " +
    " INNER JOIN CLUB_PLAYER_MAPPING CPM ON CPM.CLUBID = C.ID " +
    " INNER JOIN USER U ON U.ID = CPM.PLAYERID " +
    " WHERE U.DELETEDAT IS NULL " 
const userDao = new function () {
    this.insertOrUpdatePlayer = function (data) {
        if (data.id) {
            return this.updateUser(data)
        } else {
            return this.insertUser(data)
        }
    }
    this.getUserDetail = function (userReq) {
        return db.query(USER_DETAILS, {
            replacements: userReq,
            type: db.QueryTypes.SELECT
        }).then((user) => {
            if (user && user.length > 0) {
                if (user && user[0] ) {
                    let query1
                    if (user && user[0] && user[0].roleId == 2) {
                        query1 = CLUB_LIST
                    } else {
                        query1 = CLUB_LIST_PLAYER
                    }
                    if (userReq.userId) {
                        query1 += " AND U.ID =:userId "
                    }
                    return db.query(query1, {
                        replacements: userReq,
                        type: db.QueryTypes.SELECT
                    }).then((club) => {
                        user[0].club = club
                        return user
                    })
                
                } else {
                    return user
                }
            }
        })
    }
    this.insertUser = function (userReq) {
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
                userReq.roleId = 3
                return userDbModel.create(userReq)
            }).then((savedUser) => {
                return savedUser.get();
            }).then((savedUser) => {
                userDetail = savedUser
                userReq.userId = savedUser.id
                return playerDbModel.create(userReq)
            }).then((player) => {
                return player.get();
            }).then((player) => {
                let merged = { ...userDetail, ...player };
                return merged
            })
    }
    this.updateUser = function (userReq) {
        return userDbModel.update(userReq, {
            where: {
                'id': userReq.id
            }
        }).then((savedUser) => {
            return savedUser
        }).then((savedUser) => {
            if (userReq.roleId == 3) {
                let userDetail = savedUser
                userReq.userId = userReq.id
                return playerDbModel.update(userReq, {
                    where: {
                        'userId': userReq.id
                    }
                }).then((player) => {
                    if (userReq.approvedUpdate) {
                        return db.query(APPROVE_STATUS, {
                            replacements: userReq,
                            type: db.QueryTypes.UPDATE
                        }).then((user) => {
                            let merged = { ...userDetail, ...player };
                            return merged
                        })
                    } else {
                        let merged = { ...userDetail, ...player };
                        return merged
                    }
                })
            } else {
                return savedUser
            }
        })
    }
}
module.exports = userDao;