'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantName = require('app/steps/ui/applicant/name');

describe('start-page', () => {
    let testWrapper;
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('StartPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            const excludeKeys = [
                'bullet7',
                'paragraph7'
            ];
            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page: ${expectedNextUrlForApplicantName}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForApplicantName);
        });
    });
});
