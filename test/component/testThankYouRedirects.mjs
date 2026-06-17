import TestWrapper from '../util/TestWrapper.mjs';
import initSteps from '../../app/core/initSteps.js';

const steps = initSteps.steps;

describe('ThankYou router redirects', () => {
    let testWrapper;
    const stepsToExclude = ['ThankYou', 'ShutterPage', 'ContactUs', 'Cookies', 'PrivacyPolicy', 'TermsConditions'];

    describe('Verify router will redirect to /thank-you page when payment status is success', () => {
        for (const step in steps) {
            ((step) => {
                if (!stepsToExclude.includes(step.name)) {
                    it(`test route after a payment success for page [${step}]`, async (done) => {
                        testWrapper = await TestWrapper.getInstance(step.name);
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
                                testWrapper.testGetRedirect(done, {}, '/thank-you');
                            });
                        testWrapper.destroy();
                    });
                }
            })(steps[step]);
        }
    });
});
