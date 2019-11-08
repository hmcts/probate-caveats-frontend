'use strict';

const config = require('app/config');
const ValidationStep = require('../../../../core/steps/ValidationStep');
const json = require('app/resources/en/translation/deceased/dobknown');
const FormatName = require('app/utils/FormatName');
const content = require('app/resources/en/translation/deceased/dobknown');

class DeceasedDobKnown extends ValidationStep {

    static getUrl() {
        return '/deceased-dob-known';
    }

    nextStepUrl(req, ctx) {
        return config.app.basePath + this.next(req, ctx).constructor.getUrl();
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'dobknown', value: json.optionYes, choice: 'dobknown'}
            ]
        };
        return nextStepOptions;
    }

    generateContent(ctx, formdata) {
        const content = super.generateContent(ctx, formdata);
        const deceasedName = FormatName.format(formdata.deceased);
        content.question = content.question.replace('{deceasedName}', deceasedName);
        return content;
    }

    action(ctx, formdata) {
        if (ctx.dobknown === content.optionNo) {
            delete ctx['dob-date'];
            delete ctx['dob-day'];
            delete ctx['dob-month'];
            delete ctx['dob-year'];
        }

        return [ctx, formdata];
    }
}

module.exports = DeceasedDobKnown;
