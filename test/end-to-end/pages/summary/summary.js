'use strict';

const config = require('app/config');
const pageUnderTest = require('app/steps/ui/summary/index');
const commonContent = require('app/resources/en/translation/common');

module.exports = function (redirect) {
    const I = this;

    I.seeCurrentUrlEquals(config.app.basePath + pageUnderTest.getUrl(redirect));
    // I.click('#checkAnswerHref');
    // I.switchTo();
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
