'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class AddressStep extends ValidationStep {

    handleGet(ctx, formdata) {
        if (ctx.errors) {
            const errors = ctx.errors;
            delete ctx.errors;
            if (formdata) {
                delete formdata[this.section].errors;
            }
            return [ctx, errors];
        }
        return [ctx];
    }

    handlePost(ctx, errors) {
        ctx.address = ctx.postcodeAddress || ctx.freeTextAddress;
        ctx.postcode = ctx.postcode ? ctx.postcode.toUpperCase() : ctx.postcode;
        if (!ctx.postcodeAddress) {
            delete ctx.addresses;
        }
        delete ctx.referrer;
        return [ctx, errors];
    }
}

module.exports = AddressStep;
