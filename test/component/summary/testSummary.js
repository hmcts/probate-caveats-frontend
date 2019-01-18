'use strict';

const TestWrapper = require('test/util/TestWrapper');
const EndOfJourney = require('app/steps/ui/endjourney/index');
const nock = require('nock');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('summary', () => {
    let testWrapper;
    const expectedNextUrlForEndOfJourney = EndOfJourney.getUrl();

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

        it(`test it redirects to deceased alias page: ${expectedNextUrlForEndOfJourney}`, (done) => {
            const data = {
                dob_day: '01',
                dob_month: '01',
                dob_year: '1999'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForEndOfJourney);
        });

    });
});
