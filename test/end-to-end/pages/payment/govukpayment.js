'use strict';
const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');
const testConfig = require('config');

async function seeGovUkPaymentPage(language ='en') {
    const commonContent = language === 'en' ? contentEn : contentCy;
    const I = this;

    I.fillField('#card-no', testConfig.govPayTestCardNos.validCardNo);
    I.fillField('#expiry-month', testConfig.govPayTestCardDetails.expiryMonth);
    I.fillField('#expiry-year', testConfig.govPayTestCardDetails.expiryYear);
    I.fillField('#cardholder-name', testConfig.govPayTestCardDetails.cardholderName);
    I.fillField('#cvc', testConfig.govPayTestCardDetails.cvc);
    I.fillField('#address-line-1', testConfig.govPayTestCardDetails.addressLine1);
    I.fillField('#address-city', testConfig.govPayTestCardDetails.addressCity);
    I.fillField('#address-postcode', testConfig.govPayTestCardDetails.addressPostcode);
    I.fillField('#email', testConfig.TestEnvEmailAddress);

    await I.navByClick(commonContent.continue);
}

module.exports = {seeGovUkPaymentPage};
