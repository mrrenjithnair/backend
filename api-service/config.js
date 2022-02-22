'use strict';

const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path').dirname(require.main.filename);

const systemConfig = yaml.safeLoad(fs.readFileSync(path + '/config/system.yaml', 'utf8'));
const messageConfig = yaml.safeLoad(fs.readFileSync(path + '/config/messages.yaml', 'utf8'));
const utilsSystemConfig = yaml.safeLoad(fs.readFileSync(__dirname + '/config/system.yaml', 'utf8'));
const utilsMessageConfig = yaml.safeLoad(fs.readFileSync(__dirname + '/config/messages.yaml', 'utf8'));
const securityConfig = yaml.safeLoad(fs.readFileSync('/opt/digivalet/config/security.yaml', 'utf8'));

const configModel = new function() {
    this.getSecurityConfig = () => {
        return securityConfig;
    }
    
    this.getMessageConfig = function() {
        return messageConfig;
    }

    this.getSystemConfig = function() {
        return systemConfig;
    }

    this.getUtilsMessageConfig = function () {
        return utilsMessageConfig;
    }

    this.getUtilsSystemConfig = function () {
        return utilsSystemConfig;
    }
};

module.exports = configModel;
