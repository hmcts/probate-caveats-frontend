'use strict';

const testConfig = require('config');

async function seeGovUkConfirmPage () {
    const I = this;

    I.seeInCurrentUrl(testConfig.TestGovUkConfirmPaymentUrl);
    await I.navByClick('#confirm');
}

module.exports = {seeGovUkConfirmPage};
