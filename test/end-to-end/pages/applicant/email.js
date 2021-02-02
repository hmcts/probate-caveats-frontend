'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/email/index');

async function enterApplicantEmail(language, email) {
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    await I.waitInUrl(pageUnderTest.getUrl());
    await I.fillField('#email', email);
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterApplicantEmail};
