/**
 * Authentication Route
 */
var utils = require('../commons/lib/utils');
var errorFactory = require('../commons/lib/factory/errorFactory');
var logger = require('../commons/lib/logger');
var swagger = require("swagger-node-express");
var constants = require('../commons/lib/constants/constants');

exports.encrypt = {
    'spec': {
        description: "Operations encryption",
        path: "/encrypt",
        method: "GET",
        summary: "Encrypts a chain of characters",
        notes: "Encrypts",
        type: "String",
        nickname: "encrypt",
        consumes: ["application/json"],
        parameters: [
            swagger.queryParam("value", "The String to encrypt", "String")
        ],
        produces: ["application/json"],
        responseMessages: [
            {
                "code": 500,
                "message": 'internal error'
            }
        ]
    },
    'action': function (req, res)
    {
        try
        {
            var decryptedValue = req.query.value;
            if(utils.isEmpty(decryptedValue))
            {
                logger.error("[" + new Date() + "]", errorFactory.parameterIsNotValid());
                res.status(500).send(errorFactory.parameterIsNotValid());
            }
            else
            {
                logger.info("[" + new Date() + "]", "Encrypting value: " + decryptedValue);
                var encryptedValue = utils.encrypt(decryptedValue, utils.getKey());
                logger.info("[" + new Date() + "]", "Encrypted value: " + encryptedValue);
                res.status(200).send({"result": encryptedValue});
            }
        }
        catch (error)
        {
            logger.error("[" + new Date() + "]", error.message);
            res.status(500).send(error);
        }
    }
};

exports.decrypt = {
    'spec': {
        description: "Operations decryption",
        path: "/decrypt",
        method: "GET",
        summary: "Decrypts a chain of characters",
        notes: "Decrypts",
        type: "String",
        nickname: "decrypt",
        consumes: ["application/json"],
        parameters: [
            swagger.queryParam("value", "The String to decrypt", "String")
        ],
        produces: ["application/json"],
        responseMessages: [
            {
                "code": 500,
                "message": 'internal error'
            }
        ]
    },
    'action': function (req, res)
    {
        try
        {
            var encryptedValue = req.query.value;
            if(utils.isEmpty(encryptedValue))
            {
                logger.error("[" + new Date() + "]", errorFactory.parameterIsNotValid());
                res.status(500).send(errorFactory.parameterIsNotValid());
            }
            else
            {
                logger.info("[" + new Date() + "]", "Decrypting value: " + encryptedValue);
                var decryptedValue = utils.decrypt(encryptedValue, utils.getKey());
                logger.info("[" + new Date() + "]", "Decrypted value: " + decryptedValue);
                res.status(200).send({"result": decryptedValue});
            }
        }
        catch (error)
        {
            if(error && !utils.isEmpty(error.message) && error.message.indexOf(constants.ERROR_VALUE_MALFORMED) > -1)
            {
             error = errorFactory.encryptedValueMalformed();
            }
            logger.error("[" + new Date() + "]", error.message);
            res.status(500).send(error);
        }
    }
};

