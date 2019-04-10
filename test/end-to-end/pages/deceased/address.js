'use strict';

const config = require('app/config');
const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/address/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(config.app.basePath + pageUnderTest.getUrl());
    I.click('.summary');
    I.fillField('#freeTextAddress', 'test address for deceased');
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
