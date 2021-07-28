'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/startapply/index');

async function startApplication(language ='en', checkCookies = false) {
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    await I.waitInUrl(pageUnderTest.getUrl());

    const numVisibleCookieBannerEls = await I.grabNumberOfVisibleElements({css: '#cm-cookie-banner'});
    if (numVisibleCookieBannerEls === 1) {
        await I.waitForText(commonContent.cookieBannerEssentialCookies);

        if (checkCookies) {
            const cookiesContent = require(`app/resources/${language}/translation/static/cookies`);

            // nav to cookies page and switch off cookies
            await I.navByClick({css: 'a[href="/cookies"]'});
            await I.checkInUrl('/cookies');
            await I.waitForText(cookiesContent.paragraph1);
            await I.seeElement('#cm-cookie-banner');

            // switch on ga
            const analyticsYesLocator = {css: '#analytics'};
            await I.scrollTo(analyticsYesLocator);
            await I.waitForEnabled(analyticsYesLocator);
            await I.click(analyticsYesLocator);

            // switch off ga
            const analyticsNoLocator = {css: '#analytics-2'};
            await I.scrollTo(analyticsNoLocator);
            await I.waitForEnabled(analyticsNoLocator);
            await I.click(analyticsNoLocator);

            // switch on apm
            const apmYesLocator = {css: '#apm'};
            await I.scrollTo(apmYesLocator);
            await I.waitForEnabled(apmYesLocator);
            await I.click(apmYesLocator);

            // switch off apm
            const apmNoLocator = {css: '#apm-2'};
            await I.scrollTo(apmNoLocator);
            await I.waitForEnabled(apmNoLocator);
            await I.click(apmNoLocator);

            // save settings
            await I.scrollTo({css: 'button.govuk-button[type="submit"]'});
            await I.click(cookiesContent.save, {css: 'button.govuk-button[type="submit"]'});

            // return to eligibility page
            await I.amOnLoadedPage('/start-eligibility', language);
            await I.dontSeeElement('#cm-cookie-banner');
        } else {
            // just reject additional cookies
            const rejectLocator = {css: 'button.govuk-button[data-cm-action="reject"]'};
            await I.waitForEnabled(rejectLocator);
            await I.click(rejectLocator);
            const hideLocator = {css: 'button.govuk-button[data-cm-action="hide"]'};
            await I.waitForVisible(hideLocator);
            await I.waitForEnabled(hideLocator);
            await I.click(hideLocator);
        }
    }
    await I.navByClick(commonContent.start);

}

module.exports = {startApplication};
