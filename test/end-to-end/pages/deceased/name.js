'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/name/index');

async function enterDeceasedName(language ='en', firstName, lastName) {
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    await I.waitInUrl(pageUnderTest.getUrl());
    await I.fillField('#firstName', firstName);
    await I.fillField('lastName', lastName);
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterDeceasedName};
