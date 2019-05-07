'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Summary = require('app/steps/ui/summary/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const basePath = config.app.basePath;

describe('deceased-address', () => {
    let testWrapper;
    const expectedNextUrlForSummary = basePath + Summary.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAddress');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedAddress');

        it('test right content loaded on the page', (done) => {
            const excludeKeys = ['selectAddress'];
            const sessionData = {
                applicant: 'value',
                deceased: {
                    firstName: 'Jason',
                    lastName: 'Smith'
                }
            };

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'Jason Smith'};
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test error messages displayed for missing data', (done) => {
            const data = {addressFound: 'none'};

            testWrapper.testErrors(done, data, 'required', ['addressLine1', 'postTown', 'newPostCode']);
        });

        it(`test it redirects to summary page: ${expectedNextUrlForSummary}`, (done) => {
            const data = {
                addressLine1: 'value',
                postTown: 'value',
                newPostCode: 'value'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForSummary);
        });

    });
});
