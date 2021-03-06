'use strict';

const systemConfig = require('./config.js').getSystemConfig();
process.env.nodeEnv = systemConfig.general.environment;
const env = process.env.nodeEnv || 'dev';
const isDebug = (env === 'dev' || env === 'local');

const SwaggerExpress = require('swagger-express-mw');
const http = require('http');
const app = require('express')();
const bodyParser = require('body-parser');
module.exports = app;

var config = {
    appRoot: __dirname, // required config
    swaggerSecurityHandlers: {
        api_key: function(req, res, next) {
            let apiKey = req.headers.api_key;
            // Do something with api key
            next();
        }
    }
};


SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) {
        throw err;
    }

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(function(req, res, next) {
        next();
    });

    // install middleware
    swaggerExpress.register(app);
    var server = http.createServer(app);


    process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });

    var port = process.env.PORT || 10020;
    server.listen(port);

    console.log('server started at: http://127.0.0.1:' + port);
});
