const Step = require('app/core/steps/Step');
const featureToggle = require('app/utils/FeatureToggle');
const config = require('config');

class StartApply extends Step {

    static getUrl () {
        return '/start-apply';
    }

    handleGet(ctx, formdata, featureToggles) {
        const isFtFeesIncrease2026 = featureToggle.isEnabled(featureToggles, 'ft_probate_fee_increase_2026');
        ctx.applicationFee = isFtFeesIncrease2026 ? config.payment.applicationFee2026 : config.payment.applicationFee;
        return [ctx];
    }
}

module.exports = StartApply;
