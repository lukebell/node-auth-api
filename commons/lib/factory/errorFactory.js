/**
 * Defined Errors of API
 */

var AuthError = require('../components/AuthError');

/**
 * @returns {*} Error containing data that describes the error
 */
exports.parameterIsNotValid = function ()
{
    return new AuthError('AUT-001', 'Body Parameter must not be empty or null.');
};

/**
 * @returns {*} Error containing data that describes the error
 */
exports.requestIsInvalid = function ()
{
    return new AuthError('AUT-002', 'The request is invalid');
};

/**
 * @returns {*} Error containing data that describes the error
 */
exports.invalidQueryParameter = function (invalidParameters)
{
    return new AuthError('AUT-003', 'Sent parameter(s) ' + invalidParameters + ' is/are not valid.');
};

/**
 * @returns {*} Error containing data that describes the error
 */
exports.encryptedValueMalformed = function ()
{
    return new AuthError('AUT-004', 'Error encrypted value malformed.');
};
