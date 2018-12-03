'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/alias/index');

module.exports = function (option) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    if (option === 'Yes') {
        I.click('#alias-optionYes');
    } else {
        I.click('#alias-optionNo');
    }

    I.click(commonContent.continue);
};
