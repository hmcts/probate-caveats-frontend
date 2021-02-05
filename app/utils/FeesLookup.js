'use strict';

const services = require('app/components/services');
const logger = require('app/components/logger');
const logInfo = (message, applicationId = 'Init') => logger(applicationId).info(message);
const FeatureToggle = require('app/utils/FeatureToggle');
const config = require('config');

class FeesLookup {

    constructor(applicationId, session) {
        this.applicationId = applicationId;
        this.data = FeatureToggle.isEnabled(session.featureToggles, 'ft_newfee_register_code')?config.services.feesRegister.caveat_newfee_data: config.services.feesRegister.caveat_fee_data;
        logInfo(`Fee data from config: ${JSON.stringify(this.data)}`);
        this.data = config.services.feesRegister.caveat_newfee_data;
    }

    lookup(authToken) {
        return createCall(this.applicationId, this.data, authToken);
    }
}

const createCall = async (applicationId, data, authToken) => {
    const fees = {
        status: 'success',
        applicationversion: 0,
        applicationcode: '',
        total: 0
    };
    logInfo(`Sending fee request to api with the following payload: ${JSON.stringify(data)}`, applicationId);
    await services.feesLookup(data, authToken, applicationId)
        .then(res => {
            if (identifyAnyErrors(res)) {
                fees.status = 'failed';
            } else {
                fees.total = res.fee_amount;
                fees.applicationversion = res.version;
                fees.applicationcode = res.code;
            }
        });
    return fees;
};

/*
 * if no fee_amount is returned, we assume an error has occurred
 * this caters for 404 type messages etc.
 */
const identifyAnyErrors = (res) => {
    return !res.fee_amount;
};

module.exports = FeesLookup;
