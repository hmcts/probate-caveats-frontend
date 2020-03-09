'use strict';

const config = require('config');
const DeceasedOtherNames = require('app/steps/ui/deceased/othernames/index');
const {unset, set, isEmpty} = require('lodash');
const ActionStepRunner = require('app/core/runners/ActionStepRunner');

class RemoveAlias extends DeceasedOtherNames {

    static getUrl(index = '*') {
        return `/other-names/remove/${index}`;
    }

    nextStepUrl(req, ctx) {
        return config.app.basePath + this.next(req, ctx).constructor.getUrl();
    }

    constructor(steps, section, templatePath, i18next, schema, language) {
        super(steps, section, templatePath, i18next, schema, language);
        this.section = 'deceased';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.index = req.params[0];
        unset(ctx, `otherNames.${ctx.index}`);
        return ctx;
    }

    runner() {
        return new ActionStepRunner();
    }

    handlePost(ctx, errors, formdata) {
        set(formdata, 'deceased.otherNames', ctx.otherNames);
        if (!isEmpty(errors)) {
            set(formdata, 'deceased.errors', errors);
        }
        return [ctx, errors];
    }

}

module.exports = RemoveAlias;
