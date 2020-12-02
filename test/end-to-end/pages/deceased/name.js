'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/name/index');

async function enterDeceasedName(language ='en', firstName, lastName) {
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    I.seeInCurrentUrl(pageUnderTest.getUrl());
    I.fillField('#firstName', firstName);
    I.fillField('lastName', lastName);
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterDeceasedName};
