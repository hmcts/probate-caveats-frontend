'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/email/index');

module.exports = function (email) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.fillField('#email', email);
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
