'use strict';

const config = require('app/config');
const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dobknown/index');

module.exports = function (answer = 'Yes') {
    const I = this;

    I.seeCurrentUrlEquals(config.app.basePath + pageUnderTest.getUrl());
    I.click(`#dobknown-option${answer}`);
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
