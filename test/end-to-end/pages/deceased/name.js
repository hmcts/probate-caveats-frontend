'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/name/index');

module.exports = function (firstName, lastName) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.fillField('#firstName', firstName);
    I.fillField('lastName', lastName);
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
