import PaymentBreakdown from '../../../app/steps/ui/payment/breakdown/index.js';
import TestWrapper from '../../util/TestWrapper.mjs';
import Thankyou from '../../../app/steps/ui/thankyou/index.js';
import config from 'config';
import security from '../../../app/components/security.js';
import services from '../../../app/components/services.js';
import sinon from 'sinon';
import testCommonContent from '../common/testCommonContent.mjs';

const basePath = config.app.basePath;

describe('paymentStatus', () => {
    let testWrapper;
    const expectedNextUrlForThankYou = basePath + Thankyou.getUrl();
    const expectedNextUrlForPaymentBreakdown = basePath + PaymentBreakdown.getUrl();
    let servicesMock, securityMock;

    beforeEach(async () => {
        testWrapper = await TestWrapper.getInstance('PaymentStatus');
        servicesMock = sinon.mock(services);
        securityMock = sinon.mock(security);
    });

    afterEach(() => {
        testWrapper.destroy();
        servicesMock.restore();
        securityMock.restore();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('PaymentStatus');

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
