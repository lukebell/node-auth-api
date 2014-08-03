var utils = require('./utils');

/**
 * @type {string} Identifier of DEVELOPMENT environment
 */
exports.DEVELOPMENT_ENVIRONMENT_IDENTIFIER = "DEV";

/**
 * @type {string} Identifier of CERTIFICATION environment
 */
exports.CERTIFICATION_ENVIRONMENT_IDENTIFIER = "CERT";

/**
 * @type {string} Identifier of PRODUCTION environment
 */
exports.PRODUCTION_ENVIRONMENT_IDENTIFIER = "PROD";

/**
 * Gets the command line parameter sent when app was initiated, in example if app is started using node app.js PROD,
 * then the environment value will be PROD.
 * For additional information, see: http://stackoverflow.com/questions/4351521/how-to-pass-command-line-arguments-to-node-js
 *
 * @return {*} the current environment exports app is being executed
 */
exports.getEnvironment = function ()
{
    /* this is the first parameter after the node app.js command */
    var p = process.argv[2];
    if (utils.isEmpty(p))
    {
        /* if no first parameter provided (so, it was executed plain as node app.js, we assume is a LOCAL environment) */
        return p;
    }
    else
    {
        if (p != exports.DEVELOPMENT_ENVIRONMENT_IDENTIFIER &&
            p != exports.CERTIFICATION_ENVIRONMENT_IDENTIFIER &&
            p != exports.PRODUCTION_ENVIRONMENT_IDENTIFIER &&
            /* to skip this validation when running unit tests */
            process.argv[2].indexOf("test") <= -1)
        {
            console.log("PROVIDED FIRST PARAMETER MUST BE " + exports.DEVELOPMENT_ENVIRONMENT_IDENTIFIER + " OR " + exports.CERTIFICATION_ENVIRONMENT_IDENTIFIER + " OR " + exports.PRODUCTION_ENVIRONMENT_IDENTIFIER);
            process.exit(1);
        }
        else
        {
            return process.argv[2];
        }
    }
};

/**
 * @returns {string} determines the name of the running application based on the folder name
 */
exports.determineRunningApplication = function ()
{

    var services = {
            "node-auth-api": "node authorization api"
        },
        p = process.argv[1],
        servicesNames = Object.keys(services),
        i = servicesNames.length;

    while(i--) {
        if (p.indexOf(servicesNames[i]) > -1) {
            return services[servicesNames[i]];
        }
    }
    return "app";

};

/**
 * @returns {string} localhost
 */
exports.getLocalhost = function ()
{
    return "http://localhost";
};

/**
 * API PORT
 * @type {string}
 */
exports.getAPIPort = function ()
{
    return "8080";
};

/**
 * @return {*} the database port
 */
exports.getAPIHost = function (appName)
{
    switch (exports.getEnvironment())
    {
        case "DEV":
            return exports.getLocalhost() + ':' + exports.getAPIPort();

        case "CERT":
            return exports.getLocalhost() + ':' + exports.getAPIPort();

        case "PROD":
            return exports.getLocalhost() + ':' + exports.getAPIPort();
    }
    return exports.getLocalhost() + ':' + exports.getAPIPort();

};
