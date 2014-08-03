/**
 * Application main
 */

/**
 * module dependencies
 */
var express = require('express');
var http = require('http');
var app = express();
var authentication = require('./routes/authentication');
var utils = require('./commons/lib/utils');
var swagger = require("swagger-node-express");
var env = require('./commons/lib/environments');
var cors = require('cors');
var constants = require('./commons/lib/constants/constants');
var logger = require('./commons/lib/logger');

createServer(/* that serves */ authApp());

/**
 * create HTTP server that will serve Auth service
 */
function createServer(app)
{
    http.createServer(app).listen(app.get('port'), function ()
    {
        const INIT_MESSAGE = 'AUTH service listening on port ';
        logger.info("[" + new Date() + "]", INIT_MESSAGE + app.get('port'));
    });
}

/**
 * Auth application
 */
function authApp()
{
    /* express.js configurations */
    app.set('port', env.getAPIPort());
    app.set('view engine', 'jade');
    app.set('json spaces', 0);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);

    /* swagger configs */
    app.use(express.json());
    app.use(express.urlencoded());

    var subpath = express();
    app.use("/" + utils.getApiVersion(), subpath);

    //Set Content-Type to the one of the application
    function respondWithDefaultContentType(req, res, next)
    {
        res.contentType(constants.getMediaType());
        next();
    }

    app.get('/*', respondWithDefaultContentType);
    app.post('/*', respondWithDefaultContentType);
    app.put('/*', respondWithDefaultContentType);
    app.del('/*', respondWithDefaultContentType);

    swagger.setAppHandler(subpath);

    swagger
        .addGet(authentication.decrypt)
        .addGet(authentication.encrypt);

    swagger.configureDeclaration("authentication", {
        description: "Operations about encryption/decryption",
        produces: ["application/json"]
    });

    /* sets API info */
    swagger.setApiInfo({
        title: "AUTH API",
        description: "This is concept API",
        contact: "lucas811@gmail.com"
    });

    // Configures the app's base path and api version.
    swagger.configureSwaggerPaths("", "api", "");
    swagger.configure(env.getAPIHost() + '/' + utils.getApiVersion(), "1.0.0");

    app.use(cors(utils.corsOptions));

    return app;
}

