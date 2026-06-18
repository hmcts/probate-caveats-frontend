import PaymentBreakdown from '../../../app/steps/ui/payment/breakdown/index.js';
import TestWrapper from '../../util/TestWrapper.mjs';
import config from 'config';
import minimalCaveatForm from '../../data/unit/minimalcaveatform.json' with {type: 'json'};
import nock from 'nock';
import security from '../../../app/components/security.js';
import services from '../../../app/components/services.js';
import sinon from 'sinon';
import testCommonContent from '../common/testCommonContent.mjs';

const basePath = config.app.basePath;

describe('summary', () => {
    let testWrapper;
    const expectedNextUrlForThankYou = basePath + PaymentBreakdown.getUrl();
    let servicesMock, securityMock;

    beforeEach(async () => {
        testWrapper = await TestWrapper.getInstance('Summary');
        servicesMock = sinon.mock(services);
        securityMock = sinon.mock(security);
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
        servicesMock.restore();
        securityMock.restore();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('Summary');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                applicant: {
                    firstName: 'value'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const contentToExclude = [
                        'otherNamesLabel',
                        'title'
                    ];

                    testWrapper.testContent(done, {}, contentToExclude);
                });

        });

        it(`test it redirects to end of journey page: ${expectedNextUrlForThankYou}`, (done) => {
            const sessionData = minimalCaveatForm;

            servicesMock.expects('authorise').returns(Promise.resolve('authorised'));
            securityMock.expects('getUserToken').returns(Promise.resolve('token'));
            servicesMock.expects('sendToOrchestrationService').returns(
                Promise.resolve({
                    ccdCase: {
                        id: '123',
                        state: 'state'
                    },
                    registry: {
                        name: 'Birmingham'
                    }
                }));

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testRedirect(done, {}, expectedNextUrlForThankYou);
                });
        });
    });
});
