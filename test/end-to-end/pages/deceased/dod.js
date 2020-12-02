'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dod/index');

async function enterDeceasedDateOfDeath(language ='en', day, month, year) {

    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    I.seeInCurrentUrl(pageUnderTest.getUrl());
    I.fillField('#dod-day', day);
    I.fillField('#dod-month', month);
    I.fillField('#dod-year', year);
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterDeceasedDateOfDeath};
