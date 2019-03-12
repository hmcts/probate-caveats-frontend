// eslint-disable-line max-lines

'use strict';

const Thankyou = require('app/steps/ui/thankyou');
const PaymentBreakdown = require('app/steps/ui/payment/breakdown');
const sinon = require('sinon');
const TestWrapper = require('test/util/TestWrapper');
const services = require('app/components/services');
const security = require('app/components/security');

describe('paymentStatus', () => {
    let testWrapper;
    const expectedNextUrlForThankYou = Thankyou.getUrl();
    const expectedNextUrlForPaymentBreakdown = PaymentBreakdown.getUrl();
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
        //testHelpBlockContent.runTest('PaymentStatus');

        it.skip('test right content loaded on the page', (done) => {
            testWrapper.testContent(done, []);
        });

        it.skip(`test it redirects to ${expectedNextUrlForPaymentBreakdown} page when security failure`, (done) => {
            servicesMock.expects('authorise').returns(Promise.resolve({
                name: 'Error',
                message: 'Unable to find service'
            }));

            const data = {};
            testWrapper.agent.post('/prepare-session/form')
                .send()
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testRedirect(done, data, 'payment_url');
                });
        });

        it(`test it redirects to ${expectedNextUrlForThankYou} when payment status is 'Success'`, (done) => {
            servicesMock.expects('findPayment').returns(Promise.resolve({
                status: 'Success'
            }
            ));
            const data = {};
            testWrapper.agent.post('/prepare-session/form')
                .send({
                    payment: {
                        paymentId: '12345',
                        status: 'success'
                    }
                })
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    testWrapper.testRedirect(done, data, expectedNextUrlForThankYou);
                });
        });
    });
});
