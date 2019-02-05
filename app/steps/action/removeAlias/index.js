'use strict';

const DeceasedOtherNames = require('app/steps/ui/deceased/otherNames/index');
const {unset, set, isEmpty} = require('lodash');
const ActionStepRunner = require('app/core/runners/ActionStepRunner');

class RemoveAlias extends DeceasedOtherNames {

    static getUrl(index = '*') {
        return `/other-names/remove/${index}`;
    }

    constructor(steps, section, templatePath, i18next, schema) {
        super(steps, section, templatePath, i18next, schema);
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
