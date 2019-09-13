'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Summary = require('app/steps/ui/summary/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
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
        testCommonContent.runTest('DeceasedAddress');

        it('test right content loaded on the page', (done) => {
            const contentToExclude = ['selectAddress'];
            const sessionData = {
                applicant: {
                    firstName: 'value'
                },
                deceased: {
                    firstName: 'Jason',
                    lastName: 'Smith'
                }
            };

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'Jason Smith'};

                    testWrapper.testContent(done, contentData, contentToExclude);
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
