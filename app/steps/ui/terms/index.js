'use strict';

const Step = require('app/core/steps/Step');

class TermsConditions extends Step {

    static getUrl () {
        return '/terms-conditions';
    }
}

module.exports = TermsConditions;
