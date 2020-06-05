'use strict';

const services = require('app/components/services');
const logger = require('app/components/logger');
const logInfo = (message, applicationId = 'Init') => logger(applicationId).info(message);
const config = require('config');

class FeesLookup {

    constructor(applicationId) {
        this.applicationId = applicationId;
        this.data = config.services.feesRegister.feesData;
    }

    lookup(authToken) {
        return createCall(this.applicationId, this.data, authToken);
    }
}

const createCall = async (applicationId, data, authToken) => {
    const fees = {
        status: 'success',
        total: 0
    };
    logInfo(`Sending fee request to api with the following payload: ${JSON.stringify(data)}`, applicationId);
    await services.feesLookup(data, authToken, applicationId)
        .then(res => {
            if (identifyAnyErrors(res)) {
                fees.status = 'failed';
            } else {
                fees.total = res.fee_amount;
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
