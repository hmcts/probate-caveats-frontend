'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const emailValidator = require('email-validator');

class ApplicantEmail extends ValidationStep {

    static getUrl() {
        return '/applicant-email';
    }

    handlePost(ctx, errors, formdata, session) {
        if (!emailValidator.validate(ctx.email)) {
            errors.push(FieldError('email', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        return [ctx, errors];
    }

}

module.exports = ApplicantEmail;
