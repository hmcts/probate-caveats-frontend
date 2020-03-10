'use strict';

const testConfig = require('config');

module.exports = function () {
    const I = this;

    I.seeInCurrentUrl(testConfig.TestGovUkConfirmPaymentUrl);

    I.waitForNavigationToComplete('#confirm');
};
