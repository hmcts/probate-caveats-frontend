'use strict';

const validator = require('validator');
const config = require('config');
const FieldError = require('app/components/error');
const ValidationStep = require('app/core/steps/ValidationStep');

class ApplicantName extends ValidationStep {

    static getUrl() {
        return '/applicant-name';
    }
    handlePost(ctx, errors, formdata, session) {
        ['firstName', 'lastName'].forEach((field) => {
            if (ctx[field] && validator.isURL(ctx[field], config.validUrl.options)) {
                errors.push(FieldError(field, 'invalid', this.resourcePath,
                    this.generateContent({}, {}, session.language),
                    session.language
                ));
            }
        });

        return [ctx, errors];
    }
}

module.exports = ApplicantName;
