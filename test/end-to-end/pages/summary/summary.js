'use strict';

const pageUnderTest = require('app/steps/ui/summary/index');
const commonContent = require('app/resources/en/translation/common');

module.exports = function (redirect) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(redirect));
    I.click('#checkAnswerHref');
    I.switchTo();
    I.click(commonContent.continue);
};
