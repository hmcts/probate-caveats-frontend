'use strict';

const TestWrapper = require('test/util/TestWrapper');
const initSteps = require('app/core/initSteps');
const steps = initSteps.steps;

describe('StartApply router redirects', () => {
    let testWrapper;

    describe('Verify router will redirect to /start-apply if no applicant details entered', () => {
        const stepsToIgnore = ['PrivacyPolicy', 'StartApply', 'TermsConditions', 'ApplicantName', 'ContactUs', 'Cookies', 'ShutterPage'];

        for (const step in steps) {
            if (!stepsToIgnore.includes(step)) {
                ((step) => {
                    it('test route when no session data / applicant', (done) => {
                        testWrapper = new TestWrapper(step.name);
                        testWrapper.testGetRedirect(done, {}, '/start-apply');
                        testWrapper.destroy();
                    });
                })(steps[step]);
            }
        }
    });
});
