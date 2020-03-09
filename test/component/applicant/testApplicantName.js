'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantEmail = require('app/steps/ui/applicant/email/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('config');
const basePath = config.app.basePath;

describe('applicant-name', () => {
    let testWrapper;
    const expectedNextUrlForApplicantEmail = basePath + ApplicantEmail.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantName');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantName');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test error message displayed for missing data', (done) => {
            const errorsToTest = ['firstName', 'lastName'];
            const data = {
                firstName: '',
                lastName: ''
            };
            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test error message displayed for invalid firstName', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: '<dave',
                lastName: 'bassett'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid lastName', (done) => {
            const errorsToTest = ['lastName'];
            const data = {
                firstName: 'dave',
                lastName: '<bassett'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it(`test it redirects to next page: ${expectedNextUrlForApplicantEmail}`, (done) => {
            const data = {
                firstName: 'bob',
                lastName: 'smith'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantEmail);
        });
    });
});
