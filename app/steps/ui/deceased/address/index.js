'use strict';

const config = require('app/config');
const AddressStep = require('app/core/steps/AddressStep');
const FormatName = require('app/utils/FormatName');

class DeceasedAddress extends AddressStep {

    static getUrl() {
        return '/deceased-address';
    }

    nextStepUrl(req, ctx) {
        return config.app.basePath + this.next(req, ctx).constructor.getUrl();
    }

    generateContent(ctx, formdata, language) {
        const content = super.generateContent(ctx, formdata, language);
        const deceasedName = FormatName.format(formdata.deceased);
        content.question = content.question.replace('{deceasedName}', deceasedName);
        return content;
    }
}

module.exports = DeceasedAddress;
