const pageUnderTest = require('app/steps/ui/startpage/index');
const testConfig = require('test/config.js');

const useIdam = testConfig.TestUseIdam;

module.exports = function () {
    if (useIdam === 'true') {
        const I = this;

        I.amOnPage(pageUnderTest.getUrl());

        I.seeInCurrentUrl(testConfig.TestIdamLoginUrl);

        I.see('Sign in');
        I.fillField('username', process.env.testCitizenEmail);
        I.fillField('password', process.env.testCitizenPassword);

        I.click('Sign in');
    }
};
