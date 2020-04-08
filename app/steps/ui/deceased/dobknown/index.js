'use strict';

const ValidationStep = require('../../../../core/steps/ValidationStep');
const FormatName = require('app/utils/FormatName');
const content = require('app/resources/en/translation/deceased/dobknown');

class DeceasedDobKnown extends ValidationStep {

    static getUrl() {
        return '/deceased-dob-known';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'dobknown', value: 'optionYes', choice: 'dobknown'}
            ]
        };
    }

    generateContent(ctx, formdata, language) {
        const content = super.generateContent(ctx, formdata, language);
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
