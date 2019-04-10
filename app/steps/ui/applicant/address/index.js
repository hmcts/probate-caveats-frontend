'use strict';

const config = require('app/config');
const AddressStep = require('app/core/steps/AddressStep');

class ApplicantAddress extends AddressStep {

    static getUrl() {
        return '/applicant-address';
    }

    nextStepUrl(req, ctx) {
        return config.app.basePath + this.next(req, ctx).constructor.getUrl();
    }
}

module.exports = ApplicantAddress;
