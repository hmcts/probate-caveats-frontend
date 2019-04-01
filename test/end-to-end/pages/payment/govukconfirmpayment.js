'use strict';

const testConfig = require('test/config');

module.exports = function () {
    const I = this;

    I.seeInCurrentUrl(testConfig.TestGovUkConfirmPaymentUrl);

    I.waitForNavigationToComplete('#confirm');
};
