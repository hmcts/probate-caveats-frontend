const pageUnderTest = require('app/steps/ui/startpage/index');

module.exports = function () {
    const I = this;

    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click('.button.button-start');

};
