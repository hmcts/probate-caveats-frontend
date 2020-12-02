'use strict';

const pageUnderTest = require('app/steps/ui/thankyou/index');

function seeThankYouPage() {
    const I = this;

    I.seeInCurrentUrl(pageUnderTest.getUrl());
}

module.exports = {seeThankYouPage};
