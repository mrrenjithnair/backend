'use strict';

const e = require('cors');
const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const userDbModel = require('../model/user.js').user;
const playerDbModel = require('../model/player.js').player;


const SELECT_SPORTS = " SELECT * FROM SPORTS  "

const EXISITING_USER = " SELECT * FROM USER U WHERE U.EMAILID = :emailId AND U.USERNAME = :username "
const APPROVE_STATUS = " UPDATE CLUB_PLAYER_MAPPING SET approved = :approved WHERE PLAYERID = :userId AND CLUBID = :clubId "


const userDao = new function () {
    this.insertOrUpdatePlayer = function (data) {
        if (data.id) {
            return this.updateUser(data)
        } else {
            return this.insertUser(data)
        }
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