'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');

describe('cookies', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('Cookies');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            const contentData = {
                howToManageCookiesLink: config.links.howToManageCookies,
                googlePrivacyPolicyLink: config.links.googlePrivacyPolicy,
                googleAnalyticsOptOutLink: config.links.googleAnalyticsOptOut
            };

            testWrapper.testContent(done, contentData);
        });
    });
});
