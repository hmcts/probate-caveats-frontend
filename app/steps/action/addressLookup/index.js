'use strict';

const {isEmpty} = require('lodash');
const ValidationStep = require('app/core/steps/ValidationStep');
const services = require('app/components/services');
const ActionStepRunner = require('app/core/runners/ActionStepRunner');
const FieldError = require('app/components/error');

class AddressLookup extends ValidationStep {
    static getUrl() {
        return '/find-address';
    }

    runner() {
        return new ActionStepRunner();
    }

    next() {
        return this.steps[this.referrer];
    }

    * handlePost (ctx, errors, formdata) {
        this.referrer = ctx.referrer;
        let referrerData = this.getReferrerData(ctx, formdata);
        referrerData = this.pruneReferrerData(referrerData);
        referrerData.postcode = ctx.postcode;
        if (isEmpty(errors)) {
            const addresses = yield services.findAddress(ctx.postcode);
            if (!isEmpty(addresses)) {
                referrerData.addresses = addresses;
                referrerData.addressFound = 'true';
            } else {
                referrerData.addressFound = 'false';
                referrerData.errors = [FieldError('postcode', 'noAddresses', this.resourcePath, ctx)];
            }
        } else {
            referrerData.errors = errors;
        }

        return [ctx];
    }

    getReferrerData(ctx, formdata) {
        const refSection = this.steps[ctx.referrer].section;
        if (!formdata[refSection]) {
            formdata[refSection] = {};
        }
        return formdata[refSection];
    }

    pruneReferrerData(referrerData) {
        delete referrerData.addresses;
        delete referrerData.addressFound;
        delete referrerData.postcodeAddress;
        delete referrerData.freeTextAddress;
        delete referrerData.errors;
        return referrerData;
    }
}

module.exports = AddressLookup;
