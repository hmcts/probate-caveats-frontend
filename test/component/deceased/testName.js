'use strict';

const TestWrapper = require('test/util/TestWrapper');
//const DeceasedAlias = require('app/steps/ui/deceased/alias/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('deceased-name', () => {
    let testWrapper;
    //const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedName');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedName');

        it('test right content loaded on the page', (done) => {

            testWrapper.testContent(done, []);
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

        // it(`test it redirects to next page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
        //     const data = {
        //         firstName: 'Bob',
        //         lastName: 'Smith'
        //     };
        //     testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
        // });

    });
});
