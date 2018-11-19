const pageUnderTest = require('app/steps/ui/iht/paper/index');
const commonContent = require('app/resources/en/translation/common');

module.exports = function (formName, grossAmount, netAmount) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#paper' + formName);
    I.fillField('#gross' + formName, grossAmount);
    I.fillField('#net' + formName, netAmount);

    I.click(commonContent.continue);
};
