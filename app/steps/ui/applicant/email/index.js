'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ApplicantEmail extends ValidationStep {

    static getUrl() {
        return '/applicant-email';
    }
}

module.exports = ApplicantEmail;
