'use strict';

const pageUnderTest = require('app/steps/ui/thankyou/index');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
};
