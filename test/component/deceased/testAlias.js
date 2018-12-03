'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedOtherNames = require('app/steps/ui/deceased/otherNames/index');
// const DeceasedMarried = require('app/steps/ui/deceased/married/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('deceased-alias', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedOtherNames = DeceasedOtherNames.getUrl();
    // const expectedNextUrlForDeceasedMarried = DeceasedMarried.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAlias');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedAlias');

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const excludeContent = ['theDeceased'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {

                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, excludeContent, contentData);

                });
        });

        it('test alias schema validation when no data is entered', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to deceased other names page: ${expectedNextUrlForDeceasedOtherNames}`, (done) => {
            const data = {
                alias: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedOtherNames);
        });

        // it(`test it redirects to deceased married page: ${expectedNextUrlForDeceasedMarried}`, (done) => {
        //     const data = {
        //         alias: 'No'
        //     };
        //     testWrapper.agent.post('/prepare-session/form')
        //         .end(() => {
        //             testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedMarried);
        //         });
        // });
    });
});
