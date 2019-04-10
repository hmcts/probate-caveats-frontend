'use strict';

const config = require('app/config');
const pageUnderTest = require('app/steps/ui/payment/breakdown/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(config.app.basePath + pageUnderTest.getUrl());
    I.waitForNavigationToComplete('.button');
};
