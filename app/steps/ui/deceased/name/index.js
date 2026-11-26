'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require('validator');
const FieldError = require('app/components/error');
const config = require('config');
class DeceasedName extends ValidationStep {

    static getUrl() {
        return '/deceased-name';
    }
    handlePost(ctx, errors, formdata, session) {
        ['firstName', 'lastName'].forEach((field) => {
            if (ctx[field] && validator.isURL(ctx[field], config.validUrl.options)) {
                errors.push(FieldError(
                    field,
                    'invalid',
                    this.resourcePath,
                    this.generateContent({}, {}, session.language),
                    session.language
                ));
            }
        });

        return [ctx, errors];
    }
}

module.exports = DeceasedName;
