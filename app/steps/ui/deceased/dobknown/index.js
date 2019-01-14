'use strict';

const ValidationStep = require('../../../../core/steps/ValidationStep');
const json = require('app/resources/en/translation/deceased/dobknown');
const FormatName = require('app/utils/FormatName');

class DeceasedDobKnown extends ValidationStep {

    static getUrl() {
        return '/deceased-dob-known';
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

}

module.exports = DeceasedDobKnown;
