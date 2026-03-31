'use strict';
const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');
const testConfig = require('config');
const pageUnderTest = require('app/steps/ui/payment/status/index');

async function seeGovUkPaymentPage(language ='en') {
    const commonContent = language === 'en' ? contentEn : contentCy;
    const I = this;

    await I.waitForElement({css: '#card-no'});
    await I.navByClick(commonContent.cancelButton);
    I.seeInCurrentUrl(pageUnderTest.getPaymentCancelUrl());
    await I.waitForText(commonContent.cancelPayment);
    await I.navByClick(commonContent.continue);
    await I.seePaymentBreakdownPage(language);
    await I.waitForElement({css: '#card-no'});
    await I.fillField('#card-no', testConfig.govPayTestCardNos.validCardNo);
    await I.fillField('#expiry-month', testConfig.govPayTestCardDetails.expiryMonth);
    await I.fillField('#expiry-year', testConfig.govPayTestCardDetails.expiryYear);
    await I.fillField('#cardholder-name', testConfig.govPayTestCardDetails.cardholderName);
    await I.fillField('#cvc', testConfig.govPayTestCardDetails.cvc);
    await I.fillField('#address-line-1', testConfig.govPayTestCardDetails.addressLine1);
    await I.fillField('#address-city', testConfig.govPayTestCardDetails.addressCity);
    await I.fillField('#address-postcode', testConfig.govPayTestCardDetails.addressPostcode);
    await I.fillField('#email', testConfig.TestEnvEmailAddress);

    await I.navByClick(commonContent.continue);
}

module.exports = {seeGovUkPaymentPage};
