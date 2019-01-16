'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const FormatName = require('app/utils/FormatName');

class DeceasedAddress extends AddressStep {

    static getUrl() {
        return '/deceased-address';
    }

    generateContent(ctx, formdata) {
        const content = super.generateContent(ctx, formdata);
        const deceasedName = FormatName.format(formdata.deceased);
        content.question = content.question.replace('{deceasedName}', deceasedName);
        return content;
    }
}

module.exports = DeceasedAddress;
