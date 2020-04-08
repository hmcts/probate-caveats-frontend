'use strict';

const {mapValues, reduce} = require('lodash');
const Ajv = require('ajv');
const Step = require('app/core/steps/Step');
const generateErrors = require('app/components/error').generateErrors;

const validator = new Ajv({allErrors: true, v5: true});

class ValidationStep extends Step {

    get schema() {
        if (!this.schemaFile) {
            throw new TypeError(`Step ${this.name} has no schema file in it's resource folder`);
        }

        return this.schemaFile;
    }

    constructor(steps, section, templatePath, i18next, schema, language = 'en') {
        super(steps, section, templatePath, i18next, schema, language);

        this.schemaFile = schema;
        this.validateSchema = validator.compile(this.schema);
        this.properties = this.uniqueProperties(this.schema);
    }

    uniqueProperties(schema) {
        if (schema.properties) {
            return schema.properties;
        }

        if (schema.oneOf) {

            const properties = reduce(schema.oneOf, (acc, s) => {
                Object.assign(acc, s.properties);
                return acc;
            }, {});

            return mapValues(properties, (v) => ({type: v.type}));
        }

        throw new Error(`Step ${this.name} has an invalid schema: schema has no properties or oneOf keywords`);
    }

    validate(ctx, formdata, language) {
        let [isValid, errors] = [true, {}];

        //remove empty fields as ajv expects them to be absent
        Object.keys(ctx).filter(field =>
            (typeof ctx[field] === 'string' && ctx[field].trim() === '') || ctx[field] === '')
            .forEach(field => delete ctx[field]);

        if (ctx) {
            isValid = this.validateSchema(ctx);

            errors = isValid ? [] : generateErrors(this.validateSchema.errors, ctx, formdata, `${this.resourcePath}`, language);
        }
        return [isValid, errors];
    }

    isComplete(ctx, formdata) {
        return [this.validate(ctx, formdata)[0], 'inProgress'];
    }
}

module.exports = ValidationStep;
