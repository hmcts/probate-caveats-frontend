'use strict';

const config = require('app/config');
const ValidationStep = require('app/core/steps/ValidationStep');

class ApplicantName extends ValidationStep {

    static getUrl() {
        return '/applicant-name';
    }

    nextStepUrl(req, ctx) {
        return config.app.basePath + this.next(req, ctx).constructor.getUrl();
    }
}

module.exports = ApplicantName;
