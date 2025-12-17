'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const utils = require('app/components/api-utils');
const config = require('config');

const submitDataStub = sinon.stub();
const services = proxyquire('app/components/services', {
    'app/components/submit-data': submitDataStub
});

describe('services', () => {
    describe('updateCcdCasePaymentStatus(data, ctx)', () => {
        const appId = 'app_id';
        const ccdId = 'ccd_id';

        let fetchJsonStub;
        let fetchOptionsStub;

        beforeEach(() => {
            fetchJsonStub = sinon.stub(utils, 'fetchJson');
            fetchOptionsStub = sinon.stub(utils, 'fetchOptions');
        });

        afterEach(() => {
            fetchOptionsStub.restore();
            fetchJsonStub.restore();
            submitDataStub.reset();
        });

        it('should update with appId if feature toggle off', (done) => {
            submitDataStub.returns({});
            fetchJsonStub.returns(Promise.resolve({}));
            fetchOptionsStub.returns({});

            const data = {
                applicationId: appId,
                ccdCase: {
                    id: ccdId,
                },
            };
            const ctx = {
                useCcdLookupForPayment: false,
            };

            const orch_url = config.services.orchestrator.url;
            const expected_url = `${orch_url}/forms/${appId}/payments`;

            services.updateCcdCasePaymentStatus(data, ctx)
                .then(() => {
                    sinon.assert.callCount(fetchJsonStub, 1);

                    const [url] = fetchJsonStub.getCall(0).args;

                    expect(url).to.equal(expected_url);

                    done();
                });
        });

        it('should update with appId if feature toggle off', (done) => {
            submitDataStub.returns({});
            fetchJsonStub.returns(Promise.resolve({}));
            fetchOptionsStub.returns({});

            const data = {
                applicationId: appId,
                ccdCase: {
                    id: ccdId,
                },
            };
            const ctx = {
                useCcdLookupForPayment: true,
            };

            const orch_url = config.services.orchestrator.url;
            const expected_url = `${orch_url}/forms/${ccdId}/payments`;

            services.updateCcdCasePaymentStatus(data, ctx)
                .then(() => {
                    sinon.assert.callCount(fetchJsonStub, 1);

                    const [url] = fetchJsonStub.getCall(0).args;

                    expect(url).to.equal(expected_url);

                    done();
                });
        });
    });
});
