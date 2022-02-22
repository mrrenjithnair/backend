'use strict';

const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const noCache = require('nocache')
/* const request = require('request').defaults({
    strictSSL: false
}); */
const axios = require('axios');

// const logger = require('nww-core-models/utils/logUtils.js').logger;

const httpUtils = new function() {

    this.configureHelmet = function(app) {
        app.use(helmet());
        app.use(noCache());
        // Implement CSP with Helmet
        app.use(helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                //scriptSrc: [],
                styleSrc: ["'self'"],
                imgSrc: ["'self'"]
                //connectSrc: [],
                //fontSrc: [],
                //objectSrc: [],
                //mediaSrc: [],
                //f1rameSrc: []
            }
        }));
    }

    this.httpGet = function(url, headerNameValuePair, paramNameValuePair) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                headers: headerNameValuePair,
                params: paramNameValuePair
            }).then(function (response) {
                return resolve(response.data);
            }).catch(function (error) {
                return reject(error);
            });
        });
    }

    this.httpDelete = function(url, headerNameValuePair, paramNameValuePair) {
        return new Promise((resolve, reject) => {
            request({
                method: 'DELETE',
                url: url,
                headers: headerNameValuePair,
                qs: paramNameValuePair
            }, (err, response, body) => {
                if (err) {
                    return reject(err);
                }

                // handle http errors
                if (response.statusCode != 200)
                    return reject(new Error(body));

                resolve(body);
            });
        });
    }

    this.httpPost = function(url, headerNameValuePair, postBody, jsonType = true) {

        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                url: url,
                headers: headerNameValuePair,
                body: postBody,
                json: jsonType
            }, (err, response, body) => {
                if (err) {
                    // logger.error(JSON.stringify(err));
                    return reject(err);
                }

                // handle http errors
                if (response.statusCode != 200) {
                    // logger.error(JSON.stringify(body));
                    return reject(new Error(body));
                }

                resolve(body);
            });
        });
    }

    this.getHttpsOptions = function(environment) {
        if (environment === 'local') {
            return {
                key: fs.readFileSync(path.resolve(__dirname, "certs/nww-key.pem")),
                cert: fs.readFileSync(path.resolve(__dirname, "certs/nww-cert.pem")),
                passphrase: 'nwwdev'
            };
        }

        return {
            key: fs.readFileSync(path.resolve("/opt/digivalet/certs/privkey.pem")),
            cert: fs.readFileSync(path.resolve("/opt/digivalet/certs/fullchain.pem"))
        };
    }
};

module.exports = httpUtils;
