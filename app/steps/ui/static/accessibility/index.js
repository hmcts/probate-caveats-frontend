'use strict';

const Step = require('app/core/steps/Step');

class Accessibility extends Step {

    static getUrl () {
        return '/accessibility-statement';
    }
}

module.exports = Accessibility;
