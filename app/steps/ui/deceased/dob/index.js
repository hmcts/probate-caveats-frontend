'use strict';

const DateStep = require('app/core/steps/DateStep');

class DeceasedDob extends DateStep {

    static getUrl() {
        return '/deceased-dob';
    }

    dateName() {
        return 'dob';
    }
}

module.exports = DeceasedDob;
