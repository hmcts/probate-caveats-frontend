'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const summaryContentEn = require('app/resources/en/translation/summary');
const summaryContentCy = require('app/resources/cy/translation/summary');
const pageUnderTest = require('app/steps/ui/summary/index');

async function seeSummaryPage (language = 'en') {

    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const summaryContent = language === 'en' ? summaryContentEn : summaryContentCy;
    const I = this;

    await I.waitInUrl(pageUnderTest.getUrl());
    await I.waitForText(summaryContent.heading);
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {seeSummaryPage};
