'use strict';

const {get, set} = require('lodash');
const formatUrl = require('app/utils/FormatUrl');
const services = require('app/components/services');
const security = require('app/components/security');
const logger = require('app/components/logger');
const logInfo = (message, applicationId = 'Unknown') => logger(applicationId).info(message);

const lookupFees = async (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const applicantId = get(formdata, 'applicationId');
    const data = {
        applicant_type: 'all',
        channel: 'default',
        event: 'miscellaneous',
        jurisdiction1: 'family',
        jurisdiction2: 'probate registry',
        keyword: 'MNO',
        service: 'probate'
    };

    const authToken = await security.getUserToken(formatUrl.createHostname(req), applicantId);

    services.feesLookup(data, authToken, applicantId)
        .then((res) => {
            logInfo('FEE TOTAL', res.fee_amount);
            if (identifyAnyErrors(res)) {
                set(formdata, 'payment.status', false);
            } else {
                set(formdata, 'payment.status', true);
                set(formdata, 'payment.total', res.fee_amount);
            }
            next();
        });
};

/*
 * if no fee_amount is returned, we assume an error has occurred
 * this caters for 404 type messages etc.
 */
function identifyAnyErrors(res) {
    if (res.fee_amount) {
        return false;
    }
    return true;
}


module.exports = lookupFees;
