'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/dobknown/index');

module.exports = function (optionValue) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    optionValue = optionValue || 'optionYes';
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#dobknown-${optionValue}`);

    I.click(commonContent.continue);
};
