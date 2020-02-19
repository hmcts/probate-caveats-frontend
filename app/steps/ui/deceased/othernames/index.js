'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const {get, set, isEmpty} = require('lodash');
const FormatName = require('app/utils/FormatName');

class DeceasedOtherNames extends ValidationStep {

    static getUrl() {
        return '/other-names';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (!ctx.otherNames) {
            set(ctx, 'otherNames.name_0.firstName', '');
            set(ctx, 'otherNames.name_0.lastName', '');
        }
        const formdata = req.session.form;
        ctx.deceasedFullName = FormatName.format(formdata.deceased);
        return ctx;
    }

    validate(ctx, formdata, language) {
        let allValid = true;
        let allErrors = [];
        const otherNameErrors = new Map();

        if (Object.keys(ctx.otherNames).length >= 100) {
            otherNameErrors.set('name_101', [
                FieldError('numberOfOtherNames', 'maxLength', `${this.resourcePath}`, ctx, language)
            ]);
        }

        Object.entries(ctx.otherNames).forEach(([index, otherName]) => {
            const [isValid, errors] = super.validate(otherName, formdata, language);
            allValid = isValid && allValid;
            if (!isEmpty(errors)) {
                otherNameErrors.set(index, errors);
            }
        });
        if (!isEmpty(otherNameErrors)) {
            allErrors = allErrors.concat(Array.from(otherNameErrors));
        }
        return [allValid, allErrors];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);

        if (get(ctx, 'otherNames')) {
            errors = new Map(errors);
            set(fields, 'otherNames.value', new Map());
            Object.entries(ctx.otherNames).forEach(([index, otherName]) => {
                const otherNameErrors = isEmpty(errors) ? [] : errors.get(index);
                fields.otherNames.value.set(index, super.generateFields(language, otherName, otherNameErrors));
            });
            set(errors, 'otherNames', Array.from(errors));
            set(fields, 'otherNames.value', Array.from(fields.otherNames.value));
        }
        return fields;
    }

    handleGet(ctx, formdata) {
        if (ctx.errors) {
            const errors = ctx.errors;
            delete ctx.errors;
            delete formdata[this.section].errors;
            return [ctx, errors];
        }
        return [ctx];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedFullName;
        return [ctx, formdata];
    }
}

module.exports = DeceasedOtherNames;
