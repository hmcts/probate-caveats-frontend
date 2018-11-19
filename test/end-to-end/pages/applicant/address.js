const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/applicant/address/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('.summary');
    I.fillField('#freeTextAddress', 'test address');

    I.click(commonContent.continue);

};
