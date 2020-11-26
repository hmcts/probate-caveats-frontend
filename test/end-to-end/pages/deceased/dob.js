'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dob/index');

async function enterDeceasedDateOfBirth(language, day, month, year) {

    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    I.seeInCurrentUrl(pageUnderTest.getUrl());
    I.fillField('#dob-day', day);
    I.fillField('#dob-month', month);
    I.fillField('#dob-year', year);
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterDeceasedDateOfBirth};
