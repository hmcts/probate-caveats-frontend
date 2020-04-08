'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const DeceasedWrapper = require('app/wrappers/Deceased');

class DeceasedAlias extends ValidationStep {

    static getUrl() {
        return '/deceased-alias';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'alias', value: 'optionYes', choice: 'assetsInOtherNames'},
            ]
        };
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    handlePost(ctx, errors) {
        const hasAlias = (new DeceasedWrapper(ctx)).hasAlias();
        if (!hasAlias && ctx.otherNames) {
            ctx.otherNames = {};
        }
        return [ctx, errors];
    }
}

module.exports = DeceasedAlias;
