'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ThankYou = require('app/steps/ui/thankyou/index');
const nock = require('nock');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const minimalCaveatForm = require('test/data/unit/minimalcaveatform');

describe('summary', () => {
    let testWrapper;
    const expectedNextUrlForThankYou = ThankYou.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('Summary');

        it('test content loaded on the page', (done) => {
            const contentToExclude = [
                'otherNamesLabel',
                'title'
            ];
            testWrapper.testContent(done, contentToExclude);
        });

        // TODO implement nexturl test when integration to orchestration service complete
        // it(`test it redirects to end of journey page: ${expectedNextUrlForEndOfJourney}`, (done) => {
        //     const sessionData = minimalCaveatForm;
        //     const data = {};
        //     testWrapper.agent.post('/prepare-session/form')
        //         .send(sessionData)
        //         .end((err) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             testWrapper.testRedirect(done, data, expectedNextUrlForEndOfJourney);
        //         });
        // });

    });
});
