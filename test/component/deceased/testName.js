'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDoD = require('app/steps/ui/deceased/dod/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const basePath = config.app.basePath;

describe('deceased-name', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDoD = basePath + DeceasedDoD.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedName');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedName');

        it('test right content loaded on the page', (done) => {
            const sessionData = {applicant: {firstName: 'value'}};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {

            const data = {};

            testWrapper.testErrors(done, data, 'required', []);

        });

        it('test errors message displayed for invalid firstName', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: '<dee',
                lastName: 'ceased'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid lastName', (done) => {
            const errorsToTest = ['lastName'];
            const data = {
                firstName: 'dee',
                lastName: '<ceased'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeceasedDoD}`, (done) => {
            const data = {
                firstName: 'Bob',
                lastName: 'Smith'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDoD);
        });

    });
});
