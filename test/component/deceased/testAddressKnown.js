'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAddress = require('app/steps/ui/deceased/address/index');
const EndOfJourney = require('app/steps/ui/endjourney/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

const nock = require('nock');

describe('deceased-address-known', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAddress = DeceasedAddress.getUrl();
    const expectedNextUrlForEndOfJourney = EndOfJourney.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAddressKnown');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedAddressKnown');

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

        it(`test it redirects to deceased address page: ${expectedNextUrlForDeceasedAddress}`, (done) => {
            const data = {
                addressknown: 'Yes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
        });

        it(`test it redirects to end of journey page: ${expectedNextUrlForEndOfJourney}`, (done) => {
            const data = {
                addressknown: 'No'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForEndOfJourney);
        });

    });
});
