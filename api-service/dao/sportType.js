'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const userDbModel = require('../model/user.js').user;


const SELECT_SPORTS = " SELECT * " +
    " FROM SPORTS  "

const sportTypeDao = new function () {
    this.getPreferenceValues = function (project_id) {
        let residentQuery = SELECT_SPORTS;
        let queryReplacement = {
            project_id: project_id,
        };
        let preference = {}

        return db.query(residentQuery, {
            replacements: queryReplacement,
            type: db.QueryTypes.SELECT
        }).then((categories) => {
   
             preference.sportsList = categories;
             return preference
        })
    }

}
module.exports = sportTypeDao;