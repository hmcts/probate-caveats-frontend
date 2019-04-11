'use strict';

const config = require('app/config');
const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/name/index');

module.exports = function (firstname, lastname) {
    const I = this;
    I.seeCurrentUrlEquals(config.TestBasePath + pageUnderTest.getUrl());
    I.fillField('#firstName', firstname);
    I.fillField('#lastName', lastname);
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
