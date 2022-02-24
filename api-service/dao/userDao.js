'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const userDbModel = require('../model/user.js').user;
const playerDbModel = require('../model/player.js').player;


const SELECT_SPORTS = " SELECT * FROM SPORTS  "

const EXISITING_USER = " SELECT * FROM USER U WHERE U.EMAILID = :emailId AND U.USERNAME = :username "

const userDao = new function () {
    this.insertOrUpdatePlayer = function (data) {
        if (data.id) {
            return {}
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
}
module.exports = userDao;