import TestWrapper from '../util/TestWrapper.mjs';
import initSteps from '../../app/core/initSteps.js';

const steps = initSteps.steps;

describe('PaymentBreakdown router redirects', () => {
    let testWrapper;
    const stepsToExclude = ['ThankYou', 'ShutterPage', 'ContactUs', 'Cookies', 'PrivacyPolicy', 'TermsConditions',
        'PaymentBreakdown', 'PaymentStatus'];

    describe('Verify router will redirect to /payment-breakdown page when ccdCase Id is set', () => {
        for (const step in steps) {
            ((step) => {
                if (!stepsToExclude.includes(step.name)) {
                    it('test route after a payment breakdown', async (done) => {
                        testWrapper = await TestWrapper.getInstance(step.name);
                        testWrapper.agent.post('/prepare-session/form')
                            .send({
                                applicant: {
                                    firstName: 'value'
                                },
                                ccdCase: {
                                    id: '12345'
                                }
                            })
                            .end((err) => {
                                if (err) {
                                    throw err;
                                }
                                testWrapper.testGetRedirect(done, {}, '/payment-breakdown');
                            });
                        testWrapper.destroy();
                    });
                }
            })(steps[step]);
        }
    });
});
