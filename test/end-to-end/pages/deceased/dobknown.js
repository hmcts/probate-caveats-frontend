'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dobknown/index');

async function enterDeceasedDateOfBirthKnown(language ='en') {
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    I.seeInCurrentUrl(pageUnderTest.getUrl());
    I.click('#dobknown');
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterDeceasedDateOfBirthKnown};
