'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const {get} = require('lodash');

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
        if (ctx.address) {
            ctx.addressLine1 = get(ctx.address, 'addressLine1', '');
            ctx.addressLine2 = get(ctx.address, 'addressLine2', '');
            ctx.addressLine3 = get(ctx.address, 'addressLine3', '');
            ctx.postTown = get(ctx.address, 'postTown', '');
            ctx.county = get(ctx.address, 'county', '');
            ctx.newPostCode = get(ctx.address, 'postCode', '');
            ctx.country = get(ctx.address, 'country', 'United Kingdom');
        }
        return [ctx];
    }

    handlePost(ctx, errors) {
        ctx.address = {
            addressLine1: ctx.addressLine1,
            addressLine2: ctx.addressLine2,
            addressLine3: ctx.addressLine3,
            postTown: ctx.postTown,
            postCode: ctx.newPostCode,
            county: ctx.county,
            country: ctx.country
        };
        ctx.address.formattedAddress = this.getFormattedAddress(ctx.address);

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.referrer;
        delete ctx.addressLine1;
        delete ctx.addressLine2;
        delete ctx.addressLine3;
        delete ctx.postTown;
        delete ctx.county;
        delete ctx.newPostCode;
        delete ctx.country;

        return [ctx, formdata];
    }

    getFormattedAddress(address) {
        let formattedAddress = '';
        Object.values(address).forEach(value => {
            if (value) {
                formattedAddress = `${formattedAddress}${value} `;
            }
        });
        return formattedAddress;
    }

    isComplete(ctx) {
        return [Boolean(ctx.address), 'inProgress'];
    }

}

module.exports = AddressStep;
