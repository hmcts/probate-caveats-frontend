'use strict';

const TestWrapper = require('test/util/TestWrapper');
const PaymentBreakdown = require('app/steps/ui/payment/breakdown');
const nock = require('nock');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const minimalCaveatForm = require('test/data/unit/minimalcaveatform');
const sinon = require('sinon');
const services = require('app/components/services');
const security = require('app/components/security');

describe('summary', () => {
    let testWrapper;
    const expectedNextUrlForThankYou = PaymentBreakdown.getUrl();
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
        testHelpBlockContent.runTest('Summary');

        it('test content loaded on the page', (done) => {
            const sessionData = {applicant: 'value'};
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
                    testWrapper.testContent(done, contentToExclude);
                });

        });

        it(`test it redirects to end of journey page: ${expectedNextUrlForThankYou}`, (done) => {
            const sessionData = minimalCaveatForm;
            const data = {};
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
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testRedirect(done, data, expectedNextUrlForThankYou);
                });
        });
    });
});
