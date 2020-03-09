'use strict';

const config = require('config');
const DeceasedOtherNames = require('app/steps/ui/deceased/othernames/index');
const {set, isEmpty} = require('lodash');
const ActionStepRunner = require('app/core/runners/ActionStepRunner');

class AddAlias extends DeceasedOtherNames {

    static getUrl() {
        return '/other-names/add';
    }

    nextStepUrl(req, ctx) {
        return config.app.basePath + this.next(req, ctx).constructor.getUrl();
    }

    constructor(steps, section, templatePath, i18next, schema, language) {
        super(steps, section, templatePath, i18next, schema, language);
        this.section = 'deceased';
    }

    runner() {
        return new ActionStepRunner();
    }

    handlePost(ctx, errors, formdata) {
        if (isEmpty(errors)) {
            let counter = 0;
            const otherNames = {};
            Object.entries(ctx.otherNames)
                .filter(([index]) => index.startsWith('name_'))
                .forEach(([, otherName]) => {
                    set(otherNames, `name_${counter}`, otherName);
                    counter += 1;
                });
            set(otherNames, ['name_', counter, '.firstName'].join(''));
            set(otherNames, ['name_', counter, '.lastName'].join(''));
            set(ctx, 'otherNames', otherNames);
        } else {
            set(formdata, 'deceased.errors', errors);
        }
        set(formdata, 'deceased.otherNames', ctx.otherNames);
        return [ctx, errors];
    }
}

module.exports = AddAlias;
