'use strict';

const TestWrapper = require('test/util/TestWrapper');
const initSteps = require('app/core/initSteps');
const steps = initSteps.steps;

describe('ThankYou router redirects', () => {
    let testWrapper;

    describe('Verify router will redirect to /thankyou page when payment status is success', () => {
        for (const step in steps) {
            ((step) => {
                if (step.name !== 'ThankYou') {
                    it('test route after a payment success', (done) => {
                        testWrapper = new TestWrapper(step.name);
                        testWrapper.agent.post('/prepare-session/form')
                            .send({
                                applicant: 'value',
                                payment: {
                                    paymentId: '12345',
                                    status: 'Success'
                                }
                            })
                            .end((err) => {
                                if (err) {
                                    throw err;
                                }
                                testWrapper.testGetRedirect(done, {}, '/thankyou');
                            });
                        testWrapper.destroy();
                    });
                }
            })(steps[step]);
        }
    });
});
