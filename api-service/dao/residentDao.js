'use strict';

const exceptionUtil = require('./../exceptionUtils.js');
const db = require('./../db/dbConnection.js').get();
const config = require('./../config.js').getMessageConfig();
const userDbModel = require('../model/user.js').user;
const unitDao = require('./unitDao.js');
const entityUnitMappingDao = require('./entityUnitMappingDao.js');
const documentDao = require('./documentDao.js');
const addressDao = require('./addressDao.js');

const SELECT_DROPDOWN_VALUES = " SELECT DDLS.DDL_ID, DDLS.DDL_VALUE, DDLS.SUBCAT_ID, SUBCAT.SUBCAT_NAME, CAT.CAT_ID, CAT.CAT_NAME " +
    " FROM DDL_SUBCAT DDLS " +
    " INNER JOIN SUBCATEGORY SUBCAT ON SUBCAT.SUBCAT_ID = DDLS.SUBCAT_ID " +
    " INNER JOIN CATEGORY CAT ON CAT.CAT_ID = SUBCAT.CAT_ID " +
    " ORDER BY DDLS.DDL_VALUE ";

const SELECT_SUB_CATEGORIES = " SELECT DDLS.DDL_ID, DDLS.DDL_VALUE, DDLS.SUBCAT_ID, SUBCAT.SUBCAT_NAME, SUBCAT.CAT_ID " +
    " FROM DDL_SUBCAT DDLS " +
    " INNER JOIN SUBCATEGORY SUBCAT ON SUBCAT.SUBCAT_ID = DDLS.SUBCAT_ID " +
    " WHERE DDLS.SUBCAT_ID = :subcat_id ";

const SELECT_SUB_CATEGORIES_COUNT = " SELECT COUNT(DDLS.DDL_ID) COUNT " +
    " FROM DDL_SUBCAT DDLS " +
    " INNER JOIN SUBCATEGORY SUBCAT ON SUBCAT.SUBCAT_ID = DDLS.SUBCAT_ID " +
    " WHERE DDLS.SUBCAT_ID = :subcat_id ";

const SEARCH_SUBCATEGORY_BY_ID_FILTER = " AND DDLS.DDL_VALUE LIKE CONCAT('%', :search_string, '%') ";

const SELECT_RESIDENT_TYPE = " SELECT DDLS.DDL_ID, DDLS.DDL_VALUE, DDLS.SUBCAT_ID " +
    " FROM DDL_SUBCAT DDLS " +
    " WHERE DDLS.DDL_ID = :ddl_id ";

const SELECT_RESIDENT_FAMILY_LIST = " SELECT UD.USER_ID, UD.ENTITY_ID, UD.FIRST_NAME, UD.LAST_NAME, UD.DOB, " +
    " UD.MOBILE, UD.EMAIL, UD.OWNER_RELTNSHIP, DDLS.DDL_VALUE OWNER_RELTNSHIP_NAME " +
    " FROM USER_DTS UD " +
    " LEFT OUTER JOIN DDL_SUBCAT DDLS ON DDLS.DDL_ID = UD.OWNER_RELTNSHIP " +
    " INNER JOIN ENTITY_UNIT_MAPPING EUP ON EUP.ENTITY_ID = UD.ENTITY_ID " +
    " WHERE EUP.IS_ACTIVE = 1 AND EUP.IS_OWNER = 0 AND EUP.IS_RESIDENT = 1 AND EUP.UNIT_ID = :unit_id ";

const SELECT_RESIDENT_FAMILY_LIST_COUNT = " SELECT COUNT(UD.ENTITY_ID) COUNT " +
    " FROM USER_DTS UD " +
    " LEFT OUTER JOIN DDL_SUBCAT DDLS ON DDLS.DDL_ID = UD.OWNER_RELTNSHIP " +
    " INNER JOIN ENTITY_UNIT_MAPPING EUP ON EUP.ENTITY_ID = UD.ENTITY_ID " +
    " WHERE EUP.IS_ACTIVE = 1 AND EUP.IS_OWNER = 0 AND EUP.IS_RESIDENT = 1 AND EUP.UNIT_ID = :unit_id ";

const SELECT_WING_DETAILS = " SELECT WD.WING_ID, WD.WING_NAME " +
    " FROM WING_DTS WD " +
    " WHERE PROJECT_ID = :project_id ";

const residentDao = new function () {
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

    this.getSubcategories = function (inputJson) {
        let query = SELECT_SUB_CATEGORIES;
        let countQuery = SELECT_SUB_CATEGORIES_COUNT;
        let queryReplacement = inputJson;

        if (inputJson.search_string) {
            query += SEARCH_SUBCATEGORY_BY_ID_FILTER;
            countQuery += SEARCH_SUBCATEGORY_BY_ID_FILTER;
            queryReplacement.search_string = inputJson.search_string
        }

        let pageOffset = (inputJson.page_number - 1) * inputJson.page_size;
        query += ' LIMIT ' + pageOffset + ', ' + inputJson.page_size;

        return db.query(query, {
            replacements: queryReplacement,
            type: db.QueryTypes.SELECT
        }).then((subcategories) => {
            let subcategoriesList = null;
            if (subcategories || subcategories.length != 0)
                subcategoriesList = createSubcategoriesList(subcategories);
            return subcategoriesList;
        }).then((subcategoriesList) => {
            return db.query(countQuery, {
                replacements: queryReplacement,
                type: db.QueryTypes.SELECT
            }).then((subcategoryCount) => {
                return {
                    "count": subcategoryCount[0].COUNT,
                    "rows": (subcategoriesList == null) ? [] : subcategoriesList,
                    "page_count": Math.ceil(subcategoryCount[0].COUNT / inputJson.page_size),
                    'page_number': inputJson.page_number,
                    'page_size': inputJson.page_size,
                }
            });
        });
    }

    this.insertResident = function (residentReq) {
        residentReq.updated_by = 'SYSTEM';
        residentReq.entry_by = 'SYSTEM';
        residentReq.project_id = 1;
        residentReq.role_id = 1;
        return userDbModel.findOne({
            where: {
                mobile: residentReq.mobile/* ,
                project_id: residentReq.project_id */
            }
        }).then((resident) => {
            if (resident)
                throw exceptionUtil.createDVException(config.resident.residentAlreadyExists);

            return userDbModel.create(residentReq)
                .then((savedUser) => {
                    let user = savedUser.get();
                    return user;
                }).then((savedUser) => {
                    residentReq.user_id = savedUser.user_id;
                    residentReq.entity_id = savedUser.entity_id;
                    
                    return unitDao.insertOrUpdateUnit(residentReq);
                }).then((savedUnit) => {
                    if (savedUnit) {
                        residentReq.unit_id = savedUnit.unit_id;
                        return entityUnitMappingDao.insertEntityUnitMapping(residentReq);
                    }
                }).then(() => {
                    if (residentReq.identificationUpdated)
                        return deleteAndInsertIdentification(residentReq)
                }).then(() => {
                    if (residentReq.address2)
                        return addressDao.updateResidentAddress(residentReq);
                }).then(() => {
                    return residentReq;
                });
        });
    }

    this.updateResident = function (residentReq) {
        residentReq.updated_by = 'SYSTEM';
        residentReq.entry_by = 'SYSTEM';
        residentReq.project_id = 1;
        residentReq.role_id = 1;

        return userDbModel.findOne({
            where: {
                'user_id': residentReq.user_id
            }
        }).then((resident) => {
            if (!resident)
                throw exceptionUtil.createDVException(config.resident.residentNotFound);
            
            return resident.update(residentReq)
                .then((savedUser) => {
                    let user = savedUser.get();
                    return user;
                }).then((savedUser) => {
                    residentReq.user_id = savedUser.user_id;

                    if (residentReq.unit_id)
                        return unitDao.updateUnit(residentReq);
                    else
                        return unitDao.insertUnit(residentReq);
                }).then((savedUnit) => {
                    residentReq.unit_id = savedUnit.unit_id;
                    if (residentReq.is_resident_type_updated) {
                        return getResidentType(residentReq.resident_type)
                        .then((residentType) => {
                            if (residentType && residentType.length > 0) {
                                if (residentReq.unit_mapping_id)
                                    return entityUnitMappingDao.updateEntityUnitMapping(residentReq)
                                else
                                    return entityUnitMappingDao.insertEntityUnitMapping(residentReq);
                            }
                        });
                    }                    
                }).then((savedUnitMapping) => {
                    if (residentReq.identificationUpdated)
                        return deleteAndInsertIdentification(residentReq)
                }).then(() => {
                    if (residentReq.address2)
                        return addressDao.updateResidentAddress(residentReq);
                }).then(() => {
                    return residentReq;
                });
        });
    }

    this.getResidentFamilyList = function (inputJson) {
        let query = SELECT_RESIDENT_FAMILY_LIST;
        let countQuery = SELECT_RESIDENT_FAMILY_LIST_COUNT;
        let queryReplacement = inputJson;

        let pageOffset = (inputJson.page_number - 1) * inputJson.page_size;
        query += ' LIMIT ' + pageOffset + ', ' + inputJson.page_size;

        return db.query(query, {
            replacements: queryReplacement,
            type: db.QueryTypes.SELECT
        }).then((residentFamily) => {
            let residentFamilyList = null;
            if (residentFamily || residentFamily.length != 0)
                residentFamilyList = createResidentFamilyList(residentFamily);
            return residentFamilyList;
        }).then((residentFamilyList) => {
            return db.query(countQuery, {
                replacements: queryReplacement,
                type: db.QueryTypes.SELECT
            }).then((residentFamilyCount) => {
                return {
                    "count": residentFamilyCount[0].COUNT,
                    "rows": (residentFamilyList == null) ? [] : residentFamilyList,
                    "page_count": Math.ceil(residentFamilyCount[0].COUNT / inputJson.page_size),
                    'page_number': inputJson.page_number,
                    'page_size': inputJson.page_size,
                }
            });
        });
    }

    this.getResidentFamilyById = function (inputJson) {
        return userDbModel.findOne({
            where: {
                user_id: inputJson.user_id/* ,
                project_id: residentReq.project_id */
            }
        }).then((resident) => {
            console.log('resident', resident)
            if (!resident)
                throw exceptionUtil.createDVException(config.resident.residentNotFound);
            return resident;
        });
    }

    this.insertResidentFamily = function (inputJson) {
        inputJson.updated_by = 'SYSTEM';
        inputJson.entry_by = 'SYSTEM';
        inputJson.project_id = 1;
        inputJson.role_id = 1;
        return userDbModel.findOne({
            where: {
                mobile: inputJson.mobile/* ,
                project_id: inputJson.project_id */
            }
        }).then((user) => {
            if (user)
                throw exceptionUtil.createDVException(config.resident.residentAlreadyExists);

            return userDbModel.create(inputJson)                
        }).then((savedUser) => {
            let user = savedUser.get();
            return user;
        }).then((savedUser) => {
            inputJson.user_id = savedUser.user_id;
            inputJson.entity_id = savedUser.entity_id;
            return entityUnitMappingDao.insertEntityUnitMapping(inputJson);
        }).then(() => {
            if (inputJson.address2)
                return addressDao.updateResidentAddress(inputJson);
        }).then(() => {
            return inputJson;
        });
    }

    this.updateResidentFamily = function (inputJson) {
        inputJson.updated_by = 'SYSTEM';
        inputJson.entry_by = 'SYSTEM';
        inputJson.project_id = 1;
        inputJson.role_id = 1;
        return userDbModel.findOne({
            where: {
                user_id: inputJson.user_id/* ,
                project_id: inputJson.project_id */
            }
        }).then((user) => {
            if (!user)
                throw exceptionUtil.createDVException(config.resident.residentNotFound);

            return user.update(inputJson)
                .then((savedUser) => {
                    let user = savedUser.get();
                    return user;
                }).then((user) => {
                    inputJson.entity_id = user.entity_id;
                    if (inputJson.address2)
                        return addressDao.updateResidentAddress(inputJson);
                }).then(() => {
                    return inputJson;
                });
        });
    }

    function createRearrangedCategories(categories) {
        let catrgoryObj = {}
        for (let i = 0; i < categories.length; i++) {
            if (catrgoryObj.hasOwnProperty(categories[i]['CAT_NAME'])) {
                if (catrgoryObj[categories[i]['CAT_NAME']].hasOwnProperty(categories[i]['SUBCAT_NAME'])) {
                    let item = createDDLValueObject(categories[i]);
                    catrgoryObj[categories[i]['CAT_NAME']][categories[i]['SUBCAT_NAME']].push(item);
                } else {
                    catrgoryObj[categories[i]['CAT_NAME']][categories[i]['SUBCAT_NAME']] = [];
                    let item = createDDLValueObject(categories[i]);
                    catrgoryObj[categories[i]['CAT_NAME']][categories[i]['SUBCAT_NAME']].push(item);
                }
            } else {
                catrgoryObj[categories[i]['CAT_NAME']] = {};
                catrgoryObj[categories[i]['CAT_NAME']][categories[i]['SUBCAT_NAME']] = [];
                let item = createDDLValueObject(categories[i]);
                catrgoryObj[categories[i]['CAT_NAME']][categories[i]['SUBCAT_NAME']].push(item);
            }
        }
        return catrgoryObj;
    }

    function createDDLValueObject(item) {
        return {
            ddl_id: item.DDL_ID,
            ddl_value: item.DDL_VALUE,
            subcat_id: item.SUBCAT_ID,
            subcat_name: item.SUBCAT_NAME,
            cat_id: item.CAT_ID,
        }
    }

    function createSubcategoriesList(subcategories) {
        let subcategoryArray = [];
        let subcategoryDetail = {}
        for (let i = 0; i < subcategories.length; i++) {
            subcategoryDetail = createDDLValueObject(subcategories[i]);
            subcategoryArray.push(subcategoryDetail);
        }
        return subcategoryArray;
    }

    function getResidentType(resident_type) {
        let queryReplacement = {
            ddl_id: resident_type
        }
        return db.query(SELECT_RESIDENT_TYPE, {
            replacements: queryReplacement,
            type: db.QueryTypes.SELECT
        }).then((residentType) => {
            // if (!residentType || residentType.length == 0)
            //     throw exceptionUtil.createDVException(config.residentType.residentTypeNotFound);
            return residentType;
        });
    }

    function deleteAndInsertIdentification(inputJson) {
        let documentIdArray = inputJson.identification.map((item) => item.doc_id);
        return documentDao.deleteAllInformationDocuments(documentIdArray)
            .then(() => {
                let documentArray = []
                inputJson.identification.forEach(function (item) {
                    item.entity_id = inputJson.entity_id;
                    item.entry_by = inputJson.entry_by;
                    item.updated_by = inputJson.updated_by;
                    documentArray.push(item);
                });
                return documentDao.insertDocuments(documentArray);
            });
    }

    function createResidentFamilyList(inputJson) {
        let residentFamilyArray = [];
        let residentFamilyDetail = {}
        for (let i = 0; i < inputJson.length; i++) {
            residentFamilyDetail = {
                user_id: inputJson[i].USER_ID,
                entity_id: inputJson[i].ENTITY_ID,
                first_name: inputJson[i].FIRST_NAME,
                last_name: inputJson[i].LAST_NAME,
                dob: inputJson[i].DOB,
                mobile: inputJson[i].MOBILE,
                email: inputJson[i].EMAIL,
                owner_reltnship: inputJson[i].OWNER_RELTNSHIP,
                owner_reltnship_name: inputJson[i].OWNER_RELTNSHIP_NAME,
            }
            residentFamilyArray.push(residentFamilyDetail);
        }
        return residentFamilyArray;
    }

    function createWingList(inputJson) {
        let wingArray = [];
        let wingDetail = {}
        for (let i = 0; i < inputJson.length; i++) {
            wingDetail = {
                wing_id: inputJson[i].WING_ID,
                wing_name: inputJson[i].WING_NAME,
            }
            wingArray.push(wingDetail);
        }
        return  {
            wing: wingArray
        }
    }

}
module.exports = residentDao;