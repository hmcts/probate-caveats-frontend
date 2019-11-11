'use strict';

const {isEmpty} = require('lodash');
const ValidationStep = require('app/core/steps/ValidationStep');
const services = require('app/components/services');
const stringUtils = require('app/components/string-utils');
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

    * handlePost(ctx, errors, formdata, session) {
        this.referrer = ctx.referrer;
        let referrerData = this.getReferrerData(ctx, formdata);
        referrerData = this.pruneReferrerData(referrerData);
        referrerData.postcode = ctx.postcode;

        if (isEmpty(errors)) {
            try {
                const addresses = yield services.findAddress(ctx.postcode);
                if (!isEmpty(addresses)) {
                    referrerData.addresses = addresses;
                    referrerData.addressFound = 'true';
                    for (const key in referrerData.addresses) {
                        referrerData.addresses[key].formattedAddress = stringUtils
                            .updateLookupFormattedAddress(
                                referrerData.addresses[key].formattedAddress,
                                referrerData.addresses[key].postcode
                            );
                    }
                } else {
                    referrerData.addressFound = 'false';
                    referrerData.errors = [FieldError('postcode', 'noAddresses', this.resourcePath, this.generateContent(ctx, {}, session.language), session.language)];
                }
            } catch (e) {
                referrerData.addressFound = 'false';
                referrerData.errors = [FieldError('postcode', 'invalid', this.resourcePath, this.generateContent(ctx, {}, session.language), session.language)];
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
