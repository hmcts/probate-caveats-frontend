'use strict';
const assert = require('chai').assert;
const sinon = require('sinon');
const services = require('app/components/services');
const utils = require('app/components/api-utils');

describe('feesLookup service tests', function () {
    let fetchJsonStub;
    let feesLookupSpy;
    let authToken;

    beforeEach(function () {
        feesLookupSpy = sinon.spy(services, 'feesLookup');
        fetchJsonStub = sinon.stub(utils, 'fetchJson');
        authToken = 'dummyToken';
    });

    afterEach(() => {
        feesLookupSpy.restore();
        fetchJsonStub.restore();
    });

    it('Should successfully lookup fees', function (done) {
        const expectedResponse = require('test/data/unit/paymentfeeslookup-response');
        fetchJsonStub.returns(Promise.resolve(expectedResponse));

        services.feesLookup(authToken)
            .then(function(actualResponse) {
                sinon.assert.alwaysCalledWith(feesLookupSpy, authToken);
                assert.strictEqual(JSON.stringify(expectedResponse), JSON.stringify(actualResponse));
                done();
            })
            .catch(done);
    });

    it('Should fail to lookup fees', function (done) {
        const expectedError = 'FetchError: request to http://localhost/feeslookup?applicant_type=all&' +
            'jurisdiction1=family&service=probate failed, reason: connect ECONNREFUSED 127.0.0.1:80';
        fetchJsonStub.returns(Promise.reject(expectedError));

        services.feesLookup(authToken)
            .then(() => {
                done(new Error('Expected method to reject.'));
            })
            .catch((err) => {
                sinon.assert.alwaysCalledWith(feesLookupSpy, authToken);
                assert.equal(err, expectedError);
                done();
            })
            .catch(done);
    });

});
