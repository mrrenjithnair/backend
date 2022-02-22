'use strict';

const exceptionUtil = require('../exceptionUtils.js');
const db = require('../db/dbConnection.js').get();
const config = require('../config.js').getMessageConfig();
const userDbModel = require('../model/user.js').user;

const SELECT_DROPDOWN_VALUES = " SELECT DDLS.DDL_ID, DDLS.DDL_VALUE, DDLS.SUBCAT_ID, SUBCAT.SUBCAT_NAME, CAT.CAT_ID, CAT.CAT_NAME " +
    " FROM DDL_SUBCAT DDLS " +
    " INNER JOIN SUBCATEGORY SUBCAT ON SUBCAT.SUBCAT_ID = DDLS.SUBCAT_ID " +
    " INNER JOIN CATEGORY CAT ON CAT.CAT_ID = SUBCAT.CAT_ID " +
    " ORDER BY DDLS.DDL_VALUE ";

const SELECT_WING_DETAILS = " SELECT WD.WING_ID, WD.WING_NAME " +
    " FROM WING_DTS WD " +
    " WHERE PROJECT_ID = :project_id ";

const sportTypeDao = new function () {
    this.getResidentDropdownValues = function (project_id) {
        let residentQuery = SELECT_DROPDOWN_VALUES;
        let queryReplacement = {
            project_id: project_id,
        };
        let categoriesFull = {}

        return db.query(residentQuery, {
            replacements: queryReplacement,
            type: db.QueryTypes.SELECT
        }).then((categories) => {
            if (!categories || categories.length == 0)
                throw exceptionUtil.createDVException(config.category.categoriesNotFound);
            categoriesFull = createRearrangedCategories(categories);
            return categoriesFull;
        }).then((categoriesFull) => {
            return db.query(SELECT_WING_DETAILS, {
                replacements: queryReplacement,
                type: db.QueryTypes.SELECT
            }).then((wing) => {
                if (wing && wing.length > 0) {
                    categoriesFull.wing = createWingList(wing)
                }
            return categoriesFull;
            });
        });
    }

}
module.exports = sportTypeDao;