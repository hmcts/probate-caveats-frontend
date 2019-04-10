'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantAddress = require('app/steps/ui/applicant/address/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const basePath = config.app.basePath;

describe('applicant-email', () => {
    let testWrapper;
    const expectedNextUrlForApplicantAddress = basePath + ApplicantAddress.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantEmail');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ApplicantEmail');

        it('test content loaded on the page', (done) => {
            const sessionData = {applicant: 'value'};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test error message displayed for missing data', (done) => {
            const errorsToTest = ['email'];
            const data = {
                email: ''
            };
            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test error message displayed for invalid firstName', (done) => {
            const errorsToTest = ['email'];
            const data = {
                email: 'test@email'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it(`test it redirects to next page: ${expectedNextUrlForApplicantAddress}`, (done) => {
            const data = {
                email: 'test@email.com'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantAddress);
        });
    });
});
