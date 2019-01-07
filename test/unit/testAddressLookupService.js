/*global describe, it, before, beforeEach, after, afterEach */
'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
const when = require('when');
const utils = require('app/components/api-utils');
const services = require('app/components/services');

describe('addressLookup service tests', function () {
    let fetchJsonStub, findAddressSpy;

    beforeEach(function () {
        fetchJsonStub = sinon.stub(utils, 'fetchJson');
        findAddressSpy = sinon.spy(services, 'findAddress');
    });

    afterEach(function () {
        fetchJsonStub.restore();
        findAddressSpy.restore();
    });

    it('Should successfully retrieve address list with postcode', function (done) {
        const expectedResponse = ['address 1', 'address 2'];
        fetchJsonStub.returns(when(expectedResponse));

        services.findAddress('postcode')
            .then(function(actualResponse) {
                sinon.assert.alwaysCalledWith(findAddressSpy, 'postcode');
                assert.strictEqual(expectedResponse, actualResponse);
                done();
            })
            .catch(done);
    });

    it('Should fail to retrieve the address list', function (done) {
        const expectedError = new Error('Failed to retrieve address list');
        fetchJsonStub.returns(when(expectedError));

        services.findAddress('postcode')
            .then(function(actualError) {
                sinon.assert.alwaysCalledWith(findAddressSpy, 'postcode');
                assert.strictEqual(expectedError, actualError);
                done();
            })
            .catch(done);
    });

});
