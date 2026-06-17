import ApplicantName from '../../app/steps/ui/applicant/name/index.js';
import TestWrapper from '../util/TestWrapper.js';
import testCommonContent from './common/testCommonContent.mjs';

describe('bilingual-gop', () => {
    let testWrapper;
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('BilingualGOP');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('BilingualGOP');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {
                bilingual: '',
            };

            testWrapper.testErrors(done, data, 'required');
        });

        it(`test it redirects to applicant name: ${expectedNextUrlForApplicantName}`, (done) => {
            const data = {
                bilingual: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
        });
    });
});
