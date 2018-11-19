const randomstring = require('randomstring');
const request = require('request');
const testConfig = require('test/config.js');

class TestConfigurator {

    constructor() {
        this.testBaseUrl = testConfig.TestIdamBaseUrl;
        this.useIdam = testConfig.TestUseIdam;
        this.setTestCitizenName();
        this.testCitizenDomain = testConfig.TestCitizenDomain.replace('/@', '@');
        this.testCitizenPassword = randomstring.generate(9);
        this.testAddUserUrl = testConfig.TestIdamAddUserUrl;
        this.testDeleteUserUrl = this.testAddUserUrl + '/';
        this.role = testConfig.TestIdamRole;
        this.paymentEnvironments = testConfig.paymentEnvironments;
        this.TestFrontendUrl = testConfig.TestFrontendUrl;
        this.useGovPay = testConfig.TestUseGovPay;
    }

    getBefore() {
        if (this.useIdam === 'true') {
            this.setEnvVars();

            const userDetails =
                {
                    'email': this.getTestCitizenEmail(),
                    'forename': this.getTestCitizenName(),
                    'surname': this.getTestCitizenName(),
                    'user_group_name': this.getTestRole(),
                    'password': this.getTestCitizenPassword()
                };

            request({
                url: this.getTestAddUserURL(),
                method: 'POST',
                json: true, // <--Very important!!!
                body: userDetails
            });
        }
    }

    getAfter() {
        if (this.useIdam === 'true') {
            request({
                url: this.getTestDeleteUserURL() + process.env.testCitizenEmail,
                method: 'DELETE'
            });

            this.resetEnvVars();
        }
    }

    setTestCitizenName() {
        this.testCitizenName = randomstring.generate({
            length: 36,
            charset: 'alphabetic'
        });
    }

    getTestCitizenName() {
        return this.testCitizenName;
    }

    getTestCitizenPassword() {
        return this.testCitizenPassword;
    }

    getTestRole() {
        return this.role;
    }

    getTestCitizenEmail() {
        return this.testCitizenName + this.testCitizenDomain;
    }

    getTestAddUserURL() {
        return this.testBaseUrl + this.testAddUserUrl;
    }

    getTestDeleteUserURL() {
        return this.testBaseUrl + this.testDeleteUserUrl;
    }

    idamInUseText(scenarioText) {
        return (this.useIdam === 'true') ? scenarioText + ' - With Idam' : scenarioText + ' - Without Idam';
    }

    setEnvVars() {
        process.env.testCitizenEmail = this.getTestCitizenEmail();
        process.env.testCitizenPassword = this.getTestCitizenPassword();
    }

    resetEnvVars() {
        process.env.testCitizenEmail = null;
        process.env.testCitizenPassword = null;
    }

    getUseGovPay() {
        return this.useGovPay;
    }

}

module.exports = TestConfigurator;
