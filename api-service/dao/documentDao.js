const exceptionUtil = require('./../exceptionUtils.js');
const db = require('./../db/dbConnection.js').get();
const config = require('./../config.js').getMessageConfig();
const documentDbModel = require('../model/document_dts.js').document_dts;

const documentDao = new function () {

    this.deleteAllInformationDocuments = function(documentIdArray) {
        if (!documentIdArray || documentIdArray.length == 0) return;
        return documentDbModel.destroy({
            where: {
                doc_id: documentIdArray
            }
        });
    }

    this.insertDocuments = function(documentArray) {
        return documentDbModel.bulkCreate(documentArray);
    }
}
module.exports = documentDao;