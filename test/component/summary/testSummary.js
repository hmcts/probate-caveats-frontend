'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ThankYou = require('app/steps/ui/thankyou/index');
const nock = require('nock');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const minimalCaveatForm = require('test/data/unit/minimalcaveatform');
const sinon = require('sinon');
const services = require('app/components/services');
const security = require('app/components/security');

describe('summary', () => {
    let testWrapper;
    const expectedNextUrlForThankYou = ThankYou.getUrl();
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
            const contentToExclude = [
                'otherNamesLabel',
                'title'
            ];
            testWrapper.testContent(done, contentToExclude);
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

    describe('sendToOrchestrationService()', () => {
        it('should return to status 500 page when service authority fails', (done) => {
            const sessionData = minimalCaveatForm;
            const data = {};
            servicesMock.expects('authorise').returns(Promise.resolve({
                name: 'Error',
                message: 'Unable to find service'
            }));
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testStatus500Page(done, data);
                });
        });
        it('should return to status 500 page when security idam calls fail', (done) => {
            const sessionData = minimalCaveatForm;
            const data = {};
            servicesMock.expects('authorise').returns(Promise.resolve('authorised'));
            securityMock.expects('getUserToken').returns(Promise.resolve({
                name: 'Error',
                message: 'Unable to find service'
            }));
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testStatus500Page(done, data);
                });
        });
        it('should return to status 500 page when orchestration call fails', (done) => {
            const sessionData = minimalCaveatForm;
            const data = {};
            servicesMock.expects('authorise').returns(Promise.resolve('authorised'));
            securityMock.expects('getUserToken').returns(Promise.resolve('token'));
            servicesMock.expects('sendToOrchestrationService').returns(Promise.resolve({
                name: 'Error',
                message: 'Unable to find service'
            }));
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testStatus500Page(done, data);
                });
        });
    });
});
