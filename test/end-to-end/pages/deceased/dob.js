'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dob/index');

async function enterDeceasedDateOfBirth(language, day, month, year) {

    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    await I.waitInUrl(pageUnderTest.getUrl());
    await I.fillField('#dob-day', day);
    await I.fillField('#dob-month', month);
    await I.fillField('#dob-year', year);
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterDeceasedDateOfBirth};
