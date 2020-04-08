'use strict';

const testConfig = require('config');

module.exports = function () {
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

    I.waitForNavigationToComplete('#submit-card-details');
};
