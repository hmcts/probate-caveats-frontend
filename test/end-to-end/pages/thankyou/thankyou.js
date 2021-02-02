'use strict';

const thankYouContentEn = require('app/resources/en/translation/thankyou');
const thankYouContentCy = require('app/resources/cy/translation/thankyou');
const pageUnderTest = require('app/steps/ui/thankyou/index');

async function seeThankYouPage(language = 'en') {
    const content = language === 'en' ? thankYouContentEn : thankYouContentCy;
    const I = this;

    await I.waitInUrl(pageUnderTest.getUrl());
    await I.waitForText(content.successHeading1);
}

module.exports = {seeThankYouPage};
