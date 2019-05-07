'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/address/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('.summary');
    I.fillField('#addressLine1', 'test address for deceased line 1');
    I.fillField('#addressLine2', 'test address for deceased line 2');
    I.fillField('#addressLine3', 'test address for deceased line 3');
    I.fillField('#postTown', 'test address for deceased town');
    I.fillField('#newPostCode', 'postcode');
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
