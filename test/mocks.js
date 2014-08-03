var utils = require('../commons/lib/utils');

exports.auth_key="test_key";
exports.valueToEncryptValid="papuza serializer";
exports.valueToDecryptValid="db6dc0314ba497218a7b5430572db52e6bfe3185d224e2c25c4aedd041318b21";
exports.valueToDecryptMalformed="c7556e691ef6657388cc7723ecfb76817f87d8ea31034eblablabla";

/**
 * Gets Valid Encryption
 * @returns {*}
 */
exports.getValidEncryption =  function()
{
    return utils.encrypt(exports.valueToEncryptValid, exports.auth_key);
};
/**
 * Gets Valid Decryption
 * @returns {*}
 */
exports.getValidDecryption =  function()
{
    return utils.decrypt(exports.valueToDecryptValid, exports.auth_key);
};
/**
 * Gets Malformed Encryption
 * @returns {*}
 */
exports.getMalformedEncryption =  function()
{
    return utils.decrypt(exports.valueToDecryptMalformed, exports.auth_key);
};