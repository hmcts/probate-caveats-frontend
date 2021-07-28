'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');

describe('cookie-banner', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('StartEligibility');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Cookie Banner', () => {

        it('test cookie banner content loaded on the page', (done) => {
            testWrapper.testContentPresent(done, [commonContent.cookieBannerTitle,
                commonContent.cookieBannerEssentialCookies,
                commonContent.cookieBannerAnalyticCookies,
                commonContent.cookieBannerAcceptCookies,
                commonContent.cookieBannerRejectCookies,
                commonContent.cookieBannerViewCookies,
                commonContent.cookieBannerChangeCookies,
                commonContent.cookieBannerHideMessage
            ]);
        });
    });
});
