'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const content = require('app/resources/en/translation/deceased/dobknown');

class DeceasedAlias extends ValidationStep {

    static getUrl() {
        return '/deceased-alias';
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'alias', value: 'optionYes', choice: 'assetsInOtherNames'},
            ]
        };
        return nextStepOptions;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    action(ctx, formdata) {
        if (ctx.alias === content.optionNo) {
            delete ctx.otherNames;
        }
        return [ctx, formdata];
    }
}

module.exports = DeceasedAlias;
