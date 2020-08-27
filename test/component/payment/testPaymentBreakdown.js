// eslint-disable-line max-lines

'use strict';

const sinon = require('sinon');
const testCommonContent = require('test/component/common/testCommonContent');
const TestWrapper = require('test/util/TestWrapper');
const services = require('app/components/services');
const security = require('app/components/security');
const config = require('config');
const basePath = config.app.basePath;
const FeesLookup = require('app/utils/FeesLookup');
let feesLookup;

describe('paymentBreakdown', () => {
    let testWrapper;
    let servicesMock, securityMock;

    beforeEach(() => {
        testWrapper = new TestWrapper('PaymentBreakdown');
        servicesMock = sinon.mock(services);
        securityMock = sinon.mock(security);
        feesLookup = sinon.stub(FeesLookup.prototype, 'lookup');
        feesLookup.returns(Promise.resolve({
            status: 'success',
            applicationversion: 1,
            applicationcode: 'FEE0228',
            total: 3
        }));
    });

    afterEach(() => {
        testWrapper.destroy();
        servicesMock.restore();
        securityMock.restore();
        feesLookup.restore();
    });

    describe('Verify Content, Errors and Redirection', () => {
        beforeEach(() => {
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
        });

        testCommonContent.runTest('PaymentBreakdown');

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                applicant: {
                    firstName: 'value'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test it redirects to fake Gov.Pay page', (done) => {
            servicesMock.expects('createPayment').returns(Promise.resolve({
                status: 'initiated',
                _links: {
                    next_url: {
                        href: 'payment_url'
                    }
                }
            }));

            const data = {};
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send({fees: {
                    status: 'success',
                    applicationversion: 1,
                    applicationcode: 'FEE0228',
                    total: 3
                }})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testRedirect(done, data, 'payment_url');
                });
        });
    });

    describe('Handle api failures', () => {

        it('test error message when service authentication fails', (done) => {
            const data = {};
            servicesMock.expects('authorise').returns(Promise.resolve({
                name: 'Error',
                message: 'Unable to find service'
            }));
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send({fees: {
                    status: 'success',
                    applicationversion: 1,
                    applicationcode: 'FEE0228',
                    total: 3
                }})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testErrors(done, data, 'failure', ['authorisation']);
                });
        });

        it('test error message when idam authentication fails', (done) => {
            servicesMock.expects('authorise').returns(Promise.resolve('authorised'));
            securityMock.expects('getUserToken').returns(Promise.resolve({
                name: 'Error',
                message: 'Unable to find service'
            }));
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send({fees: {
                    status: 'success',
                    applicationversion: 1,
                    applicationcode: 'FEE0228',
                    total: 3
                }})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testErrors(done, {}, 'failure', ['authorisation']);
                });
        });

        it('test error message when orchestrator service fails', (done) => {
            servicesMock.expects('authorise').returns(Promise.resolve('authorised'));
            securityMock.expects('getUserToken').returns(Promise.resolve('token'));
            servicesMock.expects('sendToOrchestrationService').returns(Promise.resolve({
                name: 'Error',
                message: 'Unable to find service'
            }));
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send({fees: {
                    status: 'success',
                    applicationversion: 1,
                    applicationcode: 'FEE0228',
                    total: 3
                }})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testErrors(done, {}, 'failure', ['submit']);
                });
        });

        it('test error message when paymentId exists but findPayment service call fails', (done) => {
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
            servicesMock.expects('findPayment').returns(Promise.resolve({
                name: 'Error',
                message: 'Unable to find service'}));
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send({
                    payment: {
                        paymentId: 12345
                    },
                    fees: {
                        status: 'success',
                        applicationversion: 1,
                        applicationcode: 'FEE0228',
                        total: 3
                    }
                })
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testErrors(done, data, 'failure', ['payment']);
                });
        });

        it('test error message when createPayment service call fails', (done) => {
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
            servicesMock.expects('createPayment').returns(Promise.resolve({
                name: 'Error',
                message: 'Unable to find service'}));
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send({fees: {
                    status: 'success',
                    applicationversion: 1,
                    applicationcode: 'FEE0228',
                    total: 3
                }})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testErrors(done, {}, 'failure', ['payment']);
                });
        });
    });
});
