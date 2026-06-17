import TestWrapper from '../util/TestWrapper.mjs';
import initSteps from '../../app/core/initSteps.js';

const steps = initSteps.steps;

describe('StartApply router redirects', () => {
    let testWrapper;

    describe('Verify router will redirect to /start-apply if no applicant details entered', () => {
        const stepsToIgnore = ['PrivacyPolicy', 'StartApply', 'TermsConditions', 'ApplicantName', 'ContactUs', 'Cookies', 'ShutterPage'];

        for (const step in steps) {
            if (!stepsToIgnore.includes(step)) {
                ((step) => {
                    it('test route when no session data / applicant', async (done) => {
                        testWrapper = await TestWrapper.getInstance(step.name);
                        testWrapper.testGetRedirect(done, {}, '/start-apply');
                        testWrapper.destroy();
                    });
                })(steps[step]);
            }
        }
    });
});
