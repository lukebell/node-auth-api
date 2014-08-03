/**
 * Unit Tests for Authorization Resource
 */
var vows = require('vows');
var assert = require('assert');
var mock = require('./mocks');
var spec = require("vows/lib/vows/reporters/spec");
var errorFactory = require('../commons/lib/factory/errorFactory');


vows.describe('Encryption/Decryption of a value').addBatch(
    {
        'when encrypts a valid value': {
            topic: function ()
            {
                return mock.getValidEncryption();
            },
            'we get a valid encryption': {
                'which is not null': function (topic)
                {
                    assert.notEqual(topic, null, 'Encryption was not performed correctly even with correct data, returning a null object');
                    //console.log(JSON.stringify(topic));
                },
                'which is not empty': function (topic)
                {
                    assert.notEqual(topic, "", 'Encryption was not performed correctly even with correct data, returning an empty object');
                },
                'where result must be a valid encryption': function (topic)
                {
                    assert.equal(topic, mock.valueToDecryptValid, 'Encryption was not performed correctly even with correct data, returning a different result.');
                }
            }
        },
        'when decrypts a valid value': {
            topic: function ()
            {
                return mock.getValidDecryption();
            },
            'we get a valid decryption': {
                'which is not null': function (topic)
                {
                    assert.notEqual(topic, null, 'Decryption was not performed correctly even with correct data, returning a null object');
                    //console.log(JSON.stringify(topic));
                },
                'which is not empty': function (topic)
                {
                    assert.notEqual(topic, "", 'Decryption was not performed correctly even with correct data, returning an empty object');
                },
                'where result must be a valid decryption': function (topic)
                {
                    assert.equal(topic, mock.valueToEncryptValid, 'Encryption was not performed correctly even with correct data, returning a different result.');
                }
            }
        },
        'when decrypts has a malformed value': {
            topic: function ()
            {
                return mock.getMalformedEncryption();
            },
            'we get a valid decryption': {
                'which throws an error': function (topic)
                {
                    assert.throws(function() {
                            throw new Error("TypeError: Bad input string");
                        },
                        Error
                    );
                    //console.log(JSON.stringify(topic));
                }
            }
        }
    }).export(module);
