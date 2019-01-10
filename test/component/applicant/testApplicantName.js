'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantEmail = require('app/steps/ui/applicant/email/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('applicant-name', () => {
    let testWrapper;
    const expectedNextUrlForApplicantEmail = ApplicantEmail.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantName');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ApplicantName');

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

        it('test error message displayed for invalid firstName with numbers', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: 'dave22',
                lastName: 'bassett'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid firstName with special characters', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: 'dave@',
                lastName: 'bassett'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid lastName with numbers', (done) => {
            const errorsToTest = ['lastName'];
            const data = {
                firstName: 'dave',
                lastName: 'bassett5'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid lastName with special characters', (done) => {
            const errorsToTest = ['lastName'];
            const data = {
                firstName: 'dave',
                lastName: '@bassett'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });
    });
});
