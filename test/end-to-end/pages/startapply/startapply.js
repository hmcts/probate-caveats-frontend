'use strict';

const pageUnderTest = require('app/steps/ui/startapply/index');

module.exports = function () {
    const I = this;

    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.waitForNavigationToComplete('.button');
};
