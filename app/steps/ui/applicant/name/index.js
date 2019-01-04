'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ApplicantName extends ValidationStep {

    static getUrl() {
        return '/applicant-name';
    }
}

module.exports = ApplicantName;
