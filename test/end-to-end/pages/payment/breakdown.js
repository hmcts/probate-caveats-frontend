'use strict';

const pageUnderTest = require('app/steps/ui/payment/breakdown/index');

module.exports = function (redirect) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl(redirect));
};
