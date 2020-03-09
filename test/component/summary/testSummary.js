'use strict';

const TestWrapper = require('test/util/TestWrapper');
const PaymentBreakdown = require('app/steps/ui/payment/breakdown');
const nock = require('nock');
const testCommonContent = require('test/component/common/testCommonContent.js');
const minimalCaveatForm = require('test/data/unit/minimalcaveatform');
const sinon = require('sinon');
const services = require('app/components/services');
const security = require('app/components/security');
const config = require('config');
const basePath = config.app.basePath;

describe('summary', () => {
    let testWrapper;
    const expectedNextUrlForThankYou = basePath + PaymentBreakdown.getUrl();
    let servicesMock, securityMock;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
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
