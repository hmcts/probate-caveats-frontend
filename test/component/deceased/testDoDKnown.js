'use strict';

const TestWrapper = require('test/util/TestWrapper');
const EndOfJourney = require('app/steps/ui/endjourney/index');
const DeceasedDob = require('app/steps/ui/deceased/dob/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

const nock = require('nock');

describe('deceased-dob-known', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDob = DeceasedDob.getUrl();
    const expectedNextUrlForEndOfJourney = EndOfJourney.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDobKnown');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedDobKnown');

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                deceased: {
                    firstName: 'Jason',
                    lastName: 'Smith'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'Jason Smith'};
                    testWrapper.testContent(done, [], contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};
            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to deceased dob known: ${expectedNextUrlForDeceasedDob}`, (done) => {
            const data = {
                dobknown: 'Yes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDob);
        });

        it(`test it redirects to deceased dob not known: ${expectedNextUrlForEndOfJourney}`, (done) => {
            const data = {
                dobknown: 'No'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForEndOfJourney);
        });

    });
});
