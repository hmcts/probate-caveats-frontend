const pageUnderTest = require('app/steps/ui/endjourney/index');
const testConfig = require('test/config.js');

module.exports = function () {
    const I = this;

    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

};
