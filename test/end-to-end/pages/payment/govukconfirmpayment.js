'use strict';

const testConfig = require('config');

async function seeGovUkConfirmPage () {
    const I = this;

    await I.waitInUrl(testConfig.TestGovUkConfirmPaymentUrl);
    const locator = {css: '#confirm'};
    await I.waitForElement(locator);
    await I.retry(2).navByClick(locator);
}

module.exports = {seeGovUkConfirmPage};
