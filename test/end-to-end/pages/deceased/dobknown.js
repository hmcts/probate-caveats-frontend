'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dobknown/index');

async function enterDeceasedDateOfBirthKnown(language ='en') {
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    await I.waitInUrl(pageUnderTest.getUrl());
    const locator = {css: '#dobknown'};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterDeceasedDateOfBirthKnown};
