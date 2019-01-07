'use strict';

const DateStep = require('app/core/steps/DateStep');

class DeceasedDod extends DateStep {

    static getUrl() {
        return '/deceased-dod';
    }

    dateName() {
        return 'dod';
    }
}

module.exports = DeceasedDod;
