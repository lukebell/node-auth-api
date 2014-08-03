/**
 * Authentication Error
 *
 * @param errorCode
 * @param message
 * @constructor
 */
function AuthError(errorCode, message)
{

    Error.call(this);

    /**
     * the error code
     *
     * @type {String}
     */
    this.errorCode = errorCode;

    /**
     * the message
     *
     * @type {String}
     */
    this.message = message;

    Error.captureStackTrace(this, AuthError);

}

AuthError.prototype = Object.create(Error.prototype);
AuthError.prototype.constructor = AuthError;
AuthError.prototype.name = "AuthError";

module.exports = AuthError;