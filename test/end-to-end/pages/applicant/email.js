'use strict';

const config = require('app/config');
const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/email/index');

module.exports = function (email) {
    const I = this;
    I.seeCurrentUrlEquals(config.app.basePath + pageUnderTest.getUrl());
    I.fillField('#email', email);
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
