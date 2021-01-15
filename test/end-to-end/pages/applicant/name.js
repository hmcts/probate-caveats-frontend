'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/name/index');

async function enterApplicantName(language ='en', firstname, lastname) {
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    await I.waitInUrl(pageUnderTest.getUrl());
    await I.fillField('#firstName', firstname);
    await I.fillField('#lastName', lastname);
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterApplicantName};
