'use strict';

const {filter, isEqual, map, uniqWith, forEach} = require('lodash');
const i18next = require('i18next');

const FieldError = (param, keyword, resourcePath, contentCtx) => {
    const key = `errors.${param}.${keyword}`;
    const errorPath = `${resourcePath.replace('/', '.')}.${key}`;
    return {
        param: param,
        msg: {
            summary: i18next.t(`${errorPath}.summary`, contentCtx),
            message: i18next.t(`${errorPath}.message`, contentCtx)
        }
    };
};

const generateErrors = (errs, ctx, formdata, errorPath, lang = 'en') => {
    i18next.changeLanguage(lang);
    const contentCtx = Object.assign({}, formdata, ctx, {});
    if (errs.find((e) => e.keyword === 'oneOf')) {
        return [FieldError('crossField', 'oneOf', errorPath, contentCtx)];
    }
    errs = filter(errs, ((e) => e.keyword !== 'oneOf'));
    const errors = map(errs, (e) => {
        let param;
        try {
            if (e.keyword === 'required' || e.keyword === 'switch') {
                param = e.params.missingProperty;
                return FieldError(param, 'required', errorPath);
            }
            [, param] = e.dataPath.split('.');
            return FieldError(param, 'invalid', errorPath);

        } catch (e) {
            throw new ReferenceError(`Error messages have not been defined for Step in content.json for errors.${param}`);
        }
    });
    return uniqWith(errors, isEqual);
};

const mapErrorsToFields = (fields, errors = []) => {
    forEach(errors, (e) => {
        if (!fields[e.param]) {
            fields[e.param] = {};
        }
        fields[e.param].error = true;
        fields[e.param].errorMessage = e.msg;
    });
    return fields;
};

module.exports = FieldError;
module.exports.generateErrors = generateErrors;
module.exports.mapErrorsToFields = mapErrorsToFields;
