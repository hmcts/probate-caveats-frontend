'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const featureToggle = require('app/utils/FeatureToggle');

class BilingualGOP extends ValidationStep {

    static getUrl() {
        return '/bilingual-gop';
    }

    isComplete(ctx, formdata, featureToggles) {
        return [ctx.bilingual || !featureToggle.isEnabled(featureToggles, 'welsh_ft'), 'inProgress'];
    }
}

module.exports = BilingualGOP;
