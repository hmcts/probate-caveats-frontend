'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/payment/breakdown/index');

async function seePaymentBreakdownPage(language) {

    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const I = this;

    I.seeInCurrentUrl(pageUnderTest.getUrl());
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {seePaymentBreakdownPage};
