const testConfig = require('config');

class TestConfigurator {

    constructor() {
        this.useGovPay = testConfig.TestUseGovPay;
        this.retryScenarios = testConfig.TestRetryScenarios;
        this.environment = testConfig.TestFrontendUrl.includes('local') ? 'local' : 'aat';
    }

    getUseGovPay() {
        return this.useGovPay;
    }

    getRetryScenarios() {
        return this.retryScenarios;
    }

    equalityAndDiversityEnabled() {
        return this.environment !== 'local';
    }

}

module.exports = TestConfigurator;
