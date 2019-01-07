'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DeceasedName extends ValidationStep {

    static getUrl() {
        return '/deceased-name';
    }
}

module.exports = DeceasedName;
