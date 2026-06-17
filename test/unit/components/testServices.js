import config from 'config';
import {expect} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import utils from '../../../app/components/api-utils.js';

const submitDataStub = sinon.stub();
const services = proxyquire('../../../app/components/services.js', {
    './submit-data.js': submitDataStub
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

        it('should update with appId', (done) => {
            submitDataStub.returns({});
            fetchJsonStub.returns(Promise.resolve({}));
            fetchOptionsStub.returns({});

            const data = {
                applicationId: appId,
                ccdCase: {
                    id: ccdId,
                },
            };
            const ctx = {};

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
