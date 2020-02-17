'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantName = require('app/steps/ui/applicant/name');
const testCommonContent = require('test/component/common/testCommonContent.js');

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
