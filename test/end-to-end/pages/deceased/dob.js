'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dob/index');

module.exports = function (day, month, year) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.fillField('#dob-day', day);
    I.fillField('#dob-month', month);
    I.fillField('#dob-year', year);
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
