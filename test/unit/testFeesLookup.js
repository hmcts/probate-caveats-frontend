// eslint-disable-line max-lines
'use strict';

const {expect} = require('chai');
const FeesLookup = require('app/utils/FeesLookup');
const sinon = require('sinon');
const utils = require('app/components/api-utils');
const services = require('app/components/services');

describe('FeesLookup', () => {
    describe('lookup()', () => {
        let feesLookup;
        let servicesMock;
        let fetchJsonStub;
        let authToken;

        beforeEach(() => {
            feesLookup = new FeesLookup('dummyApplicantId', 'dummyHostname');
            servicesMock = sinon.mock(services);
            fetchJsonStub = sinon.stub(utils, 'fetchJson');
            authToken = 'dummyToken';
        });

        afterEach(() => {
            servicesMock.restore();
            fetchJsonStub.restore();
        });

        it('should lookup caveats fees', (done) => {
            servicesMock.expects('feesLookup').returns(Promise.resolve({
                'fee_amount': 20
            }));

            const expectedResponse = {
                status: 'success',
                total: 20
            };

            fetchJsonStub.returns(Promise.resolve(''));

            feesLookup.lookup('dummyAuthToken')
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                    sinon.assert.callCount(fetchJsonStub, 1);
                });
            done();
        });

        it('should handle errors when fees api service is unavailable', (done) => {
            servicesMock.expects('feesLookup').returns(Promise.resolve(
                'Error:FetchError: request to http://localhost/fees/lookup?amount_or_volume=6000&applicant_type=personal&channel=default&event=issue&jurisdiction1=family&jurisdiction2=probate+registry&service=probate failed, reason: connect ECONNREFUSED 127.0.0.1:80'
            ));

            const expectedResponse = {
                status: 'failed',
                total: 0
            };

            fetchJsonStub.returns(Promise.resolve(''));

            feesLookup.lookup(authToken)
                .then((res) => {
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
        });
    });
});
