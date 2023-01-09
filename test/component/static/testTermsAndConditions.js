'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const commonContent = require('app/resources/en/translation/common');

describe('terms-conditions', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('TermsConditions');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const contentData = {
                privacyLink: config.links.privacy,
                cookiesLink: config.links.cookies,
                helpLineNumber: commonContent.helpTelephoneNumber,
                helpLineHours: commonContent.helpTelephoneOpeningHours,
                callChargesLink: config.links.callCharges
            };

            testWrapper.testContent(done, contentData);
        });
        it('test right HM content loaded on the page', (done) => {
            testWrapper.testContentPresent(done, ['This service is managed by His Majesty&rsquo;s Courts and Tribunals service.']);
        });
    });
});
