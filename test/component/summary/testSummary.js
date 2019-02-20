'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ThankYou = require('app/steps/ui/thankyou/index');
const nock = require('nock');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

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

        it(`test it redirects to deceased alias page: ${expectedNextUrlForThankYou}`, (done) => {
            const data = {
                dob_day: '01',
                dob_month: '01',
                dob_year: '1999'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForThankYou);
        });

    });
});
