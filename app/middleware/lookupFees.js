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

    const fee = await services.feesLookup(data, authToken, applicantId);
    set(formdata, 'payment.total', fee.total);
    logInfo('log fee total', fee.total);
    next();
};

module.exports = lookupFees;
