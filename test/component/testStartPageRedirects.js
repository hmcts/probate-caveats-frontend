'use strict';

const TestWrapper = require('test/util/TestWrapper');
const initSteps = require('app/core/initSteps');
const steps = initSteps.steps;

describe('StartPage router redirects', () => {
    let testWrapper;

    describe('Verify router will redirect to /start-page if no applicant details entered', () => {
        const stepsToExclude = ['StartPage', 'ApplicantName'];

        Object.keys(steps)
            .filter(stepName => stepsToExclude.includes(stepName))
            .forEach(stepName => delete steps[stepName]);

        for (const step in steps) {
            ((step) => {
                it('test route when no session data / applicant', (done) => {
                    testWrapper = new TestWrapper(step.name);
                    testWrapper.agent.post('/prepare-session/form')
                        .send()
                        .end((err) => {
                            if (err) {
                                throw err;
                            }
                            testWrapper.testGetRedirect(done, {}, '/start-page');
                        });
                    testWrapper.destroy();
                });
            })(steps[step]);
        }
    });
});
