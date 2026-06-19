import TestWrapper from '../util/TestWrapper.mjs';
import commonContent from '../../app/resources/en/translation/common.json' with {type: 'json'};

describe('cookie-banner', () => {
    let testWrapper;

    beforeEach(async () => {
        testWrapper = await TestWrapper.getInstance('StartApply');
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
