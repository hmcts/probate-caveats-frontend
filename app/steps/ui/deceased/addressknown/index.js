'use strict';

const ValidationStep = require('../../../../core/steps/ValidationStep');
const json = require('app/resources/en/translation/deceased/dobknown');
const FormatName = require('app/utils/FormatName');

class DeceasedAddressKnown extends ValidationStep {

    static getUrl() {
        return '/deceased-address-known';
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'addressknown', value: json.optionYes, choice: 'addressknown'}
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

module.exports = DeceasedAddressKnown;
