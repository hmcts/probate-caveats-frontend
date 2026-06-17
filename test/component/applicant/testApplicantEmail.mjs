import ApplicantAddress from '../../../app/steps/ui/applicant/address/index.js';
import TestWrapper from '../../util/TestWrapper.js';
import config from 'config';
import testCommonContent from '../common/testCommonContent.js';

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
        testCommonContent.runTest('ApplicantEmail');

        it('test content loaded on the page', (done) => {
            const sessionData = {applicant: {firstName: 'value'}};
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

        it('test error message displayed for invalid email', (done) => {
            const errorsToTest = ['email'];
            const data = {
                email: 'test@email'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for complex invalid email', (done) => {
            const errorsToTest = ['email'];
            const data = {
                email: 'test@email.c'
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
