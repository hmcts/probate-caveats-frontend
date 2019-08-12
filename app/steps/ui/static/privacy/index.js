'use strict';

const Step = require('app/core/steps/Step');

class PrivacyPolicy extends Step {

    static getUrl () {
        return '/privacy-policy';
    }
}

module.exports = PrivacyPolicy;
