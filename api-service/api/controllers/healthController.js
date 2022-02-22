'use strict';

const controllerUtils = require('./../../controllerUtils.js');
const systemConfig = require('./../../config.js').getSystemConfig();
const httpUtils = require('./../../httpUtils.js');

module.exports = {
    healthCheckGet: healthCheckGet
};

function healthCheckGet(req, res) {
    let link = systemConfig.microServiceLink.dummy;
    httpUtils.httpGet(link, {}, {}).then((data) => {
        controllerUtils.handleGatewaySuccess(req, res, data);
    }).catch((err) => {
        controllerUtils.handleError(req, res, err);
    });
}
