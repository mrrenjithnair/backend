const controllerUtils = require('./../../controllerUtils.js');
const db = require('./../../db/dbConnection.js'); //required for applying transaction
const residentDao = require('./../../dao/residentDao.js');
const modelUtils = require('./../../modelUtils.js');

module.exports = {
    getResidentDropdownValues: getResidentDropdownValues,
    getSubcategories: getSubcategories,
    insertOrUpdateResident: insertOrUpdateResident,
    getResidentFamilyList: getResidentFamilyList,
    insertOrUpdateResidentFamily: insertOrUpdateResidentFamily,
    getResidentFamilyById: getResidentFamilyById
};

function getResidentDropdownValues(req, res) {
    let project_id = req.swagger.params.project_id.value;

    let getResidentDropdownValuesFromDao = () => {
        return residentDao.getResidentDropdownValues(project_id);
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getResidentDropdownValuesFromDao);
}

function getSubcategories(req, res) {
    let arg = {
        subcat_id: req.swagger.params.subcat_id.value,
        search_string: req.swagger.params.search_string.value,
        page_size: req.swagger.params.page_size.value,
        page_number: req.swagger.params.page_number.value,
    }
    let getSubcategoriesFromDao = () => {
        return residentDao.getSubcategories(arg);
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getSubcategoriesFromDao);
}

function insertOrUpdateResident(req, res) {
    // let userId = req.token.id;
    // let apiKey = req.headers.api_key;
    let resident = req.swagger.params.resident.value;
    modelUtils.trimAllProperties(resident);
    let insertOrUpdateResidentFromDao = () => {
        if (resident.user_id) {
            return residentDao.updateResident(resident);
        } else {
            return residentDao.insertResident(resident);
        }
    };
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, insertOrUpdateResidentFromDao);
}

function getResidentFamilyList(req, res) {
    let arg = {
        unit_id: req.swagger.params.unit_id.value,
        page_size: req.swagger.params.page_size.value,
        page_number: req.swagger.params.page_number.value,
    }
    let getResidentFamilyListFromDao = () => {
        return residentDao.getResidentFamilyList(arg);
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getResidentFamilyListFromDao);
}

function getResidentFamilyById(req, res) {
    let arg = {
        user_id: req.swagger.params.user_id.value
    }
    let getResidentFamilyByIdListFromDao = () => {
        return residentDao.getResidentFamilyById(arg);
    }
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, getResidentFamilyByIdListFromDao);
}

function insertOrUpdateResidentFamily(req, res) {
    // let userId = req.token.id;
    // let apiKey = req.headers.api_key;
    let residentFamily = req.swagger.params.residentFamily.value;
    modelUtils.trimAllProperties(residentFamily);
    let insertOrUpdateResidentFamilyFromDao = () => {
        if (residentFamily.user_id) {
            return residentDao.updateResidentFamily(residentFamily);
        } else {
            return residentDao.insertResidentFamily(residentFamily);
        }
    };
    controllerUtils.applyTxAndHandleModelResponse(db, req, res, __filename, insertOrUpdateResidentFamilyFromDao);
}