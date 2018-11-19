const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/deceased/address/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('.summary');
    I.fillField('#freeTextAddress', 'test address for deceased');

    I.click(commonContent.continue);
};
