/**
 * Logger Module
 */
var winston = require('winston'),
    env = require('./environments'),
    fs = require("fs");

/**
 * Logging levels
 * NOTE: log is not a valid level cause it causes an exception within winston
 */
var config = {
    "levels": {
        info: 0,
        data: 1,
        warn: 2,
        debug: 3,
        error: 4
    },
    "colors": {
        info: 'green',
        data: 'cyan',
        warn: 'yellow',
        debug: 'blue',
        error: 'red'
    },
    "default": {
        "file": {
            filename: loggingFileName(),
            json: true,
            level: "error"
        }
    }
};

function createTransports(json) {

    if ( !json ) {
        json = config.default;
    }

    var currentEnvironment = env.getEnvironment() || "local",
        environmentConfiguration = json[currentEnvironment] || json[currentEnvironment.toLowerCase()],
        transports = [];

    if ( !environmentConfiguration ) {
        environmentConfiguration = config.default;
    }

    Object.keys(environmentConfiguration).forEach(function(transportTypeName) {

        var transportType = winston.transports[transportTypeName] || winston.transports[transportTypeName.substr(0, 1).toUpperCase() + transportTypeName.substr(1)];

        if ( transportType ) {

            transports.push(new transportType(environmentConfiguration[transportTypeName]));

        } else {

            throw new Error("Transport by name " + transportTypeName + " does not exist");

        }

    });

    return transports;

}

var logger = new winston.Logger({
    transports: createTransports(getEnvironmentLoggingConfiguration())
});

function getEnvironmentLoggingConfiguration() {
    if ( fs.existsSync("logger.json") ) {
        return JSON.parse(fs.readFileSync("logger.json", "utf8"));
    }
    return null;
}

/**
 * determines the logging file name
 * @returns {string} the loggin file name. Matches following pattern: <NAME OF SERVICE>_<YYYYMM>.json.
 */
function loggingFileName()
{
    var DEFAULT_LOGGING_FOLDER = "/logs";
    return DEFAULT_LOGGING_FOLDER + "/" + env.determineRunningApplication() + "_" + new Date() + "." + "json";
}

module.exports = logger;