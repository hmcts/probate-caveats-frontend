'use strict';

const testConfig = require('config');

async function seeGovUkConfirmPage () {
    const I = this;

    I.seeInCurrentUrl(testConfig.TestGovUkConfirmPaymentUrl);
    await I.retry(2).navByClick('#confirm');
}

module.exports = {seeGovUkConfirmPage};
