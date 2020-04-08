'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAlias = require('app/steps/ui/deceased/alias/index');
const DeceasedDob = require('app/steps/ui/deceased/dob/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('config');
const basePath = config.app.basePath;
const nock = require('nock');

describe('deceased-dob-known', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDob = basePath + DeceasedDob.getUrl();
    const expectedNextUrlForDeceasedAlias = basePath + DeceasedAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDobKnown');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedDobKnown');

        it('test right content loaded on the page', (done) => {
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

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);
        });

        it(`test it redirects to deceased dob known: ${expectedNextUrlForDeceasedDob}`, (done) => {
            const data = {
                dobknown: 'optionYes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDob);
        });

        it(`test it redirects to deceased dob not known: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            const data = {
                dobknown: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
        });

    });
});
