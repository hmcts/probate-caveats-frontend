const testConfig = require('config');

class TestConfigurator {

    constructor() {
        this.useGovPay = testConfig.TestUseGovPay;
        this.retryScenarios = testConfig.TestRetryScenarios;
    }

    getUseGovPay() {
        return this.useGovPay;
    }

    getRetryScenarios() {
        return this.retryScenarios;
    }

}

module.exports = TestConfigurator;
