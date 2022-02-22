'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

const messageConfig = yaml.safeLoad(fs.readFileSync(__dirname + '/config/model-validation-messages.yaml', 'utf8'));
const systemConfig = yaml.safeLoad(fs.readFileSync('/opt/digivalet/config/db.yaml', 'utf8'));

const modelConfig = new function() {
    this.getMessageConfig = function() {
        return messageConfig;
    }

    this.getSystemConfig = function() {
        return systemConfig;
    }
}

module.exports = modelConfig;
