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
            const session = {
                featureToggles: {'ft_newfee_register_code': false}
            };
            feesLookup = new FeesLookup('dummyApplicantId', session, 'dummyHostname');
            servicesMock = sinon.mock(services);
            fetchJsonStub = sinon.stub(utils, 'fetchJson');
            authToken = 'dummyToken';
        });

        afterEach(() => {
            servicesMock.restore();
            fetchJsonStub.restore();
        });

        it('should lookup caveats fees with correct keyword MNO when feature toggle is off', (done) => {
            const current_fee_data = {
                applicant_type: 'all',
                channel: 'default',
                event: 'miscellaneous',
                jurisdiction1: 'family',
                jurisdiction2: 'probate registry',
                keyword: 'Caveat',
                service: 'probate'
            };

            expect(feesLookup.data).to.deep.equal(current_fee_data);
            done();
        });

        it('should lookup caveats fees with correct keyword Caveats when feature toggle is on', (done) => {
            const newfee_data = {
                applicant_type: 'all',
                channel: 'default',
                event: 'miscellaneous',
                jurisdiction1: 'family',
                jurisdiction2: 'probate registry',
                keyword: 'Caveat',
                service: 'probate'
            };

            const session = {
                featureToggles: {'ft_newfee_register_code': true}
            };

            feesLookup = new FeesLookup('dummyApplicantId', session, 'dummyHostname');
            expect(feesLookup.data).to.deep.equal(newfee_data);
            done();
        });

        it('should lookup caveats fees', (done) => {
            servicesMock.expects('feesLookup').returns(Promise.resolve({
                fee_amount: 3,
                version: 0,
                code: 'FEE0288'
            }));

            const expectedResponse = {
                status: 'success',
                applicationversion: 0,
                applicationcode: 'FEE0288',
                total: 3
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
                applicationversion: 0,
                applicationcode: '',
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
