var error = require('./factory/errorFactory'),
    crypto = require('crypto');
var fs = require("fs"),
    path = require("path");
var constants = require('./constants/constants');

/**
 * Common utilities
 */

/**
 * check if the provided object is null
 * @param object the object to be checked
 * @returns {boolean} true if its not empty, otherwise false
 */
exports.isEmpty = function ()
{

    var isEmpty = false,
        i = arguments.length,
        object;

    while (i-- && !isEmpty)
    {
        object = arguments[i];
        isEmpty = object == null || object == undefined || object.length == 0 || (object instanceof Object && !(object instanceof Date) && Object.keys(object).length == 0);
    }

    return isEmpty;

};

/**
 * checks if the provided HTTP request object is not null
 * @param req the HTTP request to be validated
 */
exports.validateIfRequestIsNull = function (req)
{
    if (exports.isEmpty(req))
    {
        throw error.requestIsInvalid();
    }
};

/**
 * CORS OPTIONS
 * @type {{credentials: boolean, origin: origin}}
 */
exports.corsOptions =
{
    credentials: false,
    origin: function (origin, callback)
    {
        if (origin === undefined)
        {
            callback(null, false);
        }
        else
        {
            callback(null, true);
        }
    }
};

/**
 * Given a plain string, returns an AES 256 encrypted text of it.
 * @param decryptedString the plain text
 * @returns {*} encrypted input text
 */
exports.encrypt = function (decryptedString, key, encryptingAlgorithm)
{
    if (exports.isEmpty(decryptedString) || exports.isEmpty(key))
    {
        return null;
    }
    if(exports.isEmpty(encryptingAlgorithm))
    {
        encryptingAlgorithm = "";
    }
    var normalizedAlgorithmName = encryptingAlgorithm.toUpperCase();
    switch (normalizedAlgorithmName)
    {
        default :
        {
            var cipher = crypto.createCipher('aes-256-cbc', key);
            var crypted = cipher.update(decryptedString, 'utf8', 'hex');
            crypted += cipher.final('hex');
            return crypted;
        }
    }
};

/**
 * Given a AES 256 encrypted string, returns the plain text
 * @param encryptedString the encrypted string
 * @param key the encryption key
 * @param encryptingAlgorithm the name of the ecnryption algorithm
 * @returns {*} the plain text of the encrypted input
 */
exports.decrypt = function (encryptedString, key, encryptingAlgorithm)
{
    if (exports.isEmpty(encryptedString) || exports.isEmpty(key))
    {
        return null;
    }
    if(exports.isEmpty(encryptingAlgorithm))
    {
        encryptingAlgorithm = "";
    }
    var normalizedAlgorithmName = encryptingAlgorithm.toUpperCase();
    switch(normalizedAlgorithmName)
    {
        default:
        {
            var decipher = crypto.createDecipher('aes-256-cbc', key);
            var dec = decipher.update(encryptedString, 'hex', 'utf8');
            dec += decipher.final('utf8');
            return dec;
        }
    }
};


/**
 * checks if all the elements of first array are contained in second one in the key property
 * @param a the array that's going to be analysed to see if its contained in b
 * @param b the array that is supposed to contain array a
 *
 * @return TRUE is a is contained in b, FALSE otherwise
 */
exports.isArrayContained = function (a, b)
{
    if (a == null || b == null || exports.isEmpty(a) || exports.isEmpty(b))
    {
        return false;
    }
    for (var i = 0; i < a.length; i++)
    {
        var isPresent = false;
        for (var j = 0; j < b.length; j++)
        {
            if (a[i] == b[j].key)
            {
                isPresent = true;
            }
        }
        if (isPresent == false)
        {
            return false;
        }
    }
    return true;
};

/**
 * given two arrays a and b, returns an array that is the difference between them. In example, if b = ['a','b','c'] and
 * a = ['a','b','c','d'] then the resulting array will be ['d']
 * @param a the array to be compared
 * @param b the second array to be compared
 * @returns {Array} an array containing the items that are in a but not in b
 */
exports.diff = function (a, b)
{
    if (exports.isEmpty(a) || exports.isEmpty(b))
    {
        return [];
    }

    var diff = [];
    for (var i = 0; i < a.length; i++)
    {
        var isPresent = false;
        for (var j = 0; j < b.length; j++)
        {
            if (a[i] == b[j])
            {
                isPresent = true;
            }
        }
        if (isPresent == false)
        {
            diff.push(a[i]);
        }
    }
    return diff;
};

/**
 * transform an array to an object
 * @param array the array to be transformed to an object
 * @returns {{}} the object representation of the given array
 */
exports.arrayToObject = function (array)
{
    if (exports.isEmpty(array))
    {
        return null;
    }
    var object = {};
    for (var i = 0; i < array.length; ++i)
    {
        object[i] = array[i];
    }
    return object;
};

/**
 * given two arrays, merge results of second one into the first one
 * @param receiverArray the array that receives the elements of the second array
 * @param arrayToBeAdded the array that contains the elements that will be added to the first one
 * @returns {*} the an array that contains the items of the first array plus the second one
 */
exports.mergeArrays = function (receiverArray, arrayToBeAdded)
{
    if (exports.isEmpty(arrayToBeAdded))
    {
        return receiverArray;
    }

    for (var i = 0; i < arrayToBeAdded.length; i++)
    {
        receiverArray.push(arrayToBeAdded[i]);
    }

    return receiverArray;
};


/**
 * calculates the number of days between two dates.
 * In example, if date1 is 12/10/2014, and the second date is 15/10/2014, it would return 3.
 * If the given date is not in the future (is lower than original date), then we return 0.
 * @param date1 the start date
 * @param date2 the end date
 */
exports.daysTo = function (date1, date2)
{
    if (exports.isEmpty(date1) || exports.isEmpty(date2))
    {
        return null;
    }
    var oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / (oneDay)));
};

/**
 * Adds parent prototype methods to the childs prototype.
 * Overriden methods are added using the parent name preffix.
 * The parent constructor is added as using its name
 * @method extend
 * @param {Object} child object to put the methods from the parents prototype
 * @param {Object} parent where to take the methods to put in descendant
 */
exports.extend = function (child, parent)
{

    if (!child)
    {
        throw new Error("Child is undefined and cannot be extended");
    }
    if (!parent)
    {
        throw new Error("Parent is undefined, you cannot extend child with an undefined parent");
    }
    if (!parent.name)
    {
        throw new Error("Parent name is undefined. Please add a field name to the parent constructor where name is the name of the function. This usually creates issues in Internet Explorer." + parent);
    }

    child.prototype["extends" + parent.name] = parent;

    for (var m in parent.prototype)
    {

        if (!child.prototype.hasOwnProperty(m))
        {
            child.prototype[m] = parent.prototype[m];
        }
        else
        {
            if (!child.prototype.hasOwnProperty(parent.name + m))
            {
                //Cammel case method name
                child.prototype[parent.name.substr(0, 1).toLowerCase() + parent.name.substr(1) + m.substr(0, 1).toUpperCase() + m.substr(1)] = parent.prototype[m];
            }
        }

    }

};

/**
 * Validates if the request has the parameters defined in the params array
 *
 * @private
 * @method
 * @param {Object} req the request
 * @param {Array} params array with the name of the parameters that must be present
 * @param {String} [optional] paramSection Section of the request where to look for the parameters. Defaults to params
 */
exports.validateRequestHasParams = function (req, params, paramSection)
{

    paramSection = paramSection || "params";

    if (exports.isEmpty(params))
    {
        return;
    }

    if (exports.isEmpty(req))
    {
        throw error.requestIsInvalid();
    }

    for (var i = 0; i < params.length; i++)
    {
        if (!req[paramSection].hasOwnProperty(params[i]))
        {
            throw error.invalidQueryParameter(params[i]);
        }
    }

};
/**
 * Returns the current version of the API
 *
 * @returns {string}
 */
exports.getApiVersion = function ()
{
    return "v1";
};

/**
 * Removes elements from an array
 *
 * @param {Array} array
 * @param {Object} elements ...
 *
 * @returns {Array}
 */
exports.removeFromArray = function ()
{

    var array = arguments[0];

    for (var i = 1; i < arguments.length; i++)
    {
        array.splice(array.indexOf(arguments[i]), 1);
    }

    return array;
};

/**
 * Returns true if elements are present in the array
 *
 * @param {Array} array
 * @param {Object} elements ...
 *
 * @returns {Array}
 */
exports.inArray = function ()
{

    var array = arguments[0];

    for (var i = 1; i < arguments.length; i++)
    {
        if (array.indexOf(arguments[i]) == -1)
        {
            return false;
        }
    }

    return true;
};

/**
 * Returns true if elements are present in the array
 *
 * @param {Array} array
 * @param {Object} elements ...
 *
 * @returns {Array}
 */
exports.inString = function (strToLookInto, strToLookFor)
{
    return strToLookInto.indexOf(strToLookFor) != -1;
};

/**
 * given a valid string, returns it as  Base64
 * @param value the value to be converted to Base64
 * @return value as Base64
 */
exports.toBase64 = function (value)
{
    if (exports.isEmpty(value))
    {
        return null;
    }
    return new Buffer(value).toString('base64');
};

/**
 * given a valid encoded to Base64 string, returns it as the original value
 * @param encodedValue the value to be decoded from Base64
 * @return value as String
 */
exports.fromBase64 = function (encodedValue)
{
    if (exports.isEmpty(encodedValue))
    {
        return null;
    }
    return new String(new Buffer(encodedValue, 'base64'));
};

/**
 * Clones a JSON object
 *
 * @param {Object} obj
 * @param {Object} overrideAttributes
 * @returns {Object}
 */
exports.clone = function (obj, overrideAttributes)
{
    return require("util")._extend(obj, overrideAttributes);
};

exports.setConstant = function (obj, valueName, value, enumerable)
{
    Object.defineProperty(obj, valueName, {
        writable: false, enumerable: enumerable || false, configurable: false, value: value
    });
};

/**
 * Sets a constant in the given object
 * @param {Object} object to set the constant to
 * @param {String} constName the name of the constant
 * @param {Object} constValue value of the constant
 * @param {Boolean} [optional] enumerable determines if this constant is enumerable or not, that is if it will show up during a for each. Defaults to true
 */
exports.setConstant = function (object, constName, constValue, enumerable)
{

    if (enumerable == undefined)
    {
        enumerable = true;
    }

    Object.defineProperty(object, constName, {
        writable: false, enumerable: enumerable, configurable: false, value: constValue
    });

};

/**
 * Validates if the request body is empty or not. In case it is empty it throws an requestIsInvalid error
 * @param {Request} req http request
 */
exports.validateBodyIsNotEmpty = function (req)
{
    if (exports.isEmpty(req) || exports.isEmpty(req.body))
    {
        throw error.requestIsInvalid();
    }
};

/**
 * Joins url fragments in a consistent manner and fills in "/" as necessary.
 * Returns a url as a relative path
 *
 * @param {...String} arguments
 * @returns {String}
 */
exports.joinURL = function ()
{
    function removeFalsyElements(n)
    {
        //when used as a callback for Array.filter, any element with a "falsy" value
        //will cause the filter to drop it from the array
        return n;
    }

    var args = Array.prototype.slice.call(arguments).filter(removeFalsyElements),
        startsWith = "";
    if (args.length > 0 && args[0][0] == "/")
    {
        startsWith = "/";
    }
    args = args.map(function (elem)
    {
        return elem.replace(/^\/*|\/*$/g, "")
    }).filter(removeFalsyElements);

    return startsWith + args.join("/");
};

/**
 * Validates the values of the given map are not empty
 * @param {Map<String, Object>} mappings
 */
exports.validateNotEmpty = function (mappings)
{
    for (var i in mappings)
    {
        if (exports.isEmpty(mappings[i]))
        {
            throw new Error(["Field", i, "cannot be null or empty"].join(" "));
        }
    }
};

/**
 * Validates the values of the given map are in oneOf array
 * @param {Map<String, Object>} mappings
 */
exports.validateOneOf = function (mappings, oneOf)
{

    for (var i in mappings)
    {
        if (oneOf.indexOf(mappings[i]) == -1)
        {
            throw new Error(["Field", i, "cannot be null or empty"].join(" "));
        }
    }

};

/**
 * Given an object and a path to an attribute returns it or returns a default value if some part or it doesn't exist
 * @param obj
 * @param path
 * @param defValue
 * @returns {*}
 */
exports.defaultTo = function (obj, path, defValue)
{

    try
    {
        path = path.split(".");

        var current = obj;

        path.forEach(function (level)
        {
            current = current[level];
        });

        if (current === undefined || current === null)
        {
            return defValue;
        }

        return current;

    }
    catch (e)
    {
        return defValue;
    }

};

/**
 * Given a string with values between {} replace those with the matching keys in the map
 * @param {String} str string to replace
 * @param {Object} data mappings
 */
exports.template = function (str, data)
{
    return str.replace(/\{(\w*)\}/g, function(m, key) {
        return data.hasOwnProperty(key) ? data[key] : "";
    });
};

/**
 * Adds all swagger like service files in the folder and subfolders to swagger
 * @param {Object} swagger
 * @param {String} dir directory where to read all files that contain a swagger like service
 * @param {String} urlSuffix url suffix to add to all urls. ie: say you have localhost/api/user, if this argument were v1, then you would get localhost/v1/api/user
 */
exports.addToSwagger = function(swagger, dir, urlSuffix) {

    urlSuffix = urlSuffix || "";

    if ( dir.substr(0, 2) == "./" ) {
        dir = module.parent.filename.substr(0, module.parent.filename.lastIndexOf("/") + 1) + dir.substr(2);
    } else if ( dir.substr(0, 3) == "../" ) {
        dir = module.parent.filename.substr(0, module.parent.filename.lastIndexOf("/") + 1) + dir;
    }

    if ( fs.lstatSync(dir).isDirectory() ) {

        fs.readdirSync(dir).forEach(function(file) {

            var filePath = path.join(dir, file);

            if ( fs.lstatSync(filePath).isDirectory() ) {

                exports.addToSwagger(swagger, filePath, urlSuffix);

            } else {

                var method = dir.substr(dir.lastIndexOf("/") + 1),
                    swaggerMethod = method[0].toUpperCase() + method.substr(1);

                if ( swagger["add" + swaggerMethod] ) {

                    var swaggerHandle = require(filePath);

                    swaggerHandle.spec.path = urlSuffix + swaggerHandle.spec.path;

                    console.log(swaggerMethod, swaggerHandle.spec.path);

                    try {
                        swagger["add" + swaggerMethod](swaggerHandle);
                    } catch ( e ) {
                        console.error("Unable to add", swaggerMethod.toUpperCase(), filePath, "is it a swagger object?", e.message);
                    }

                }

            }
        });
    }
};

/**
 * Gets SHA1 Hash key
 */
function getKey()
{
    return crypto.createHash(constants.ALGORITHM_SHA1).update(constants.auth_key).digest('hex');
}

/**
 * Creates an object from another where values are not undefined
 * @param {Object} the input object
 * @param {String*} the fields of the objects to take into account
 * @returns {{}}
 */
exports.getNormalized = function() {

    var data = {},
        accepted = Array.prototype.slice.call(arguments).slice(1),
        body = arguments[0];

    Object.keys(body).forEach(function(key) {
        if ( accepted.indexOf(key) != -1 && body[key] !== undefined ) {
            data[key] = body[key];
        }
    });

    return data;

};

/**
 * Creates a directory
 */
function mkdir()
{
    var dirPath = path.join.apply(path, Array.prototype.slice.call(arguments, 0));
    if (!fs.existsSync(dirPath))
    {
        fs.mkdir(dirPath);
    }
}

exports.getKey = getKey;