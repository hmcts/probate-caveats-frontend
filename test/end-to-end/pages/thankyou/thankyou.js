'use strict';

const config = require('app/config');
const pageUnderTest = require('app/steps/ui/thankyou/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(config.app.basePath + pageUnderTest.getUrl());
};
