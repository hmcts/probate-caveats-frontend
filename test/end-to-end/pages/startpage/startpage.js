'use strict';

const config = require('app/config');
const pageUnderTest = require('app/steps/ui/startpage/index');

module.exports = function () {
    const I = this;

    I.amOnPage(config.app.basePath + pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.waitForNavigationToComplete('.button');
};
