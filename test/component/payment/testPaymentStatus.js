// eslint-disable-line max-lines

'use strict';

const Thankyou = require('app/steps/ui/thankyou');
const PaymentBreakdown = require('app/steps/ui/payment/breakdown');
const sinon = require('sinon');
const TestWrapper = require('test/util/TestWrapper');
const services = require('app/components/services');
const security = require('app/components/security');
const testCommonContent = require('test/component/common/testCommonContent');
const config = require('config');
const basePath = config.app.basePath;

describe('paymentStatus', () => {
    let testWrapper;
    const expectedNextUrlForThankYou = basePath + Thankyou.getUrl();
    const expectedNextUrlForPaymentBreakdown = basePath + PaymentBreakdown.getUrl();
    let servicesMock, securityMock;

    beforeEach(() => {
        testWrapper = new TestWrapper('PaymentStatus');
        servicesMock = sinon.mock(services);
        securityMock = sinon.mock(security);
    });

    afterEach(() => {
        testWrapper.destroy();
        servicesMock.restore();
        securityMock.restore();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content', (done) => {
            testCommonContent.runTest('PaymentStatus');
            done();
        });

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

        it(`test it redirects to ${expectedNextUrlForPaymentBreakdown} page when payment status is failed`, (done) => {
            servicesMock.expects('findPayment').returns(Promise.resolve({
                status: 'Failed'
            }));
            servicesMock.expects('updateCcdCasePaymentStatus').returns(Promise.resolve({
                ccdCase: {
                    state: 'Success'
                }
            }));
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send({
                    applicant: {
                        firstName: 'value'
                    },
                    payment: {
                        paymentId: '12345',
                        status: 'initiated'
                    }
                })
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testGetRedirect(done, {}, expectedNextUrlForPaymentBreakdown);
                });
        });

        it(`test it redirects to ${expectedNextUrlForThankYou} when payment status is 'Success'`, (done) => {
            servicesMock.expects('findPayment').returns(Promise.resolve({
                status: 'Success'
            }));
            servicesMock.expects('updateCcdCasePaymentStatus').returns(Promise.resolve({
                ccdCase: {
                    state: 'Success'
                }
            }));
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send({
                    applicant: {
                        firstName: 'value'
                    },
                    payment: {
                        paymentId: '12345',
                        status: 'initiated'
                    }
                })
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testGetRedirect(done, {}, expectedNextUrlForThankYou);
                });
        });
    });

    describe('Verify handling of failed apis', () => {

        it('Test failure of findPayment api call', (done) => {
            servicesMock.expects('authorise').returns(Promise.resolve('authorised'));
            securityMock.expects('getUserToken').returns(Promise.resolve('token'));
            servicesMock.expects('findPayment').returns(Promise.resolve({
                name: 'Error'
            }));
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send({
                    applicant: {
                        firstName: 'value'
                    },
                    payment: {
                        paymentId: '12345',
                        status: 'initiated'
                    }
                })
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testContent(done);
                });
        });

        it('Test failure of updateCcdCasePaymentStatus api call', (done) => {
            servicesMock.expects('authorise').returns(Promise.resolve('authorised'));
            securityMock.expects('getUserToken').returns(Promise.resolve('token'));
            servicesMock.expects('findPayment').returns(Promise.resolve({
                status: 'Success'
            }));
            servicesMock.expects('updateCcdCasePaymentStatus').returns(Promise.resolve({
                name: 'Error'
            }));
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send({
                    applicant: {
                        firstName: 'value'
                    },
                    payment: {
                        paymentId: '12345',
                        status: 'initiated'
                    }
                })
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testContent(done);
                });
        });
    });
});
