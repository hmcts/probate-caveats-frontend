'use strict';

const {get, set} = require('lodash');
const formatUrl = require('app/utils/FormatUrl');
const services = require('app/components/services');
const security = require('app/components/security');

const lookupFees = async (req, res, next) => {
    const session = req.session;
    const formdata = session.form;

    const data = {
        applicant_type: 'all',
        channel: 'default',
        event: 'miscellaneous',
        jurisdiction1: 'family',
        jurisdiction2: 'probate registry',
        keyword: 'MNO',
        service: 'probate'
    };

    const authToken = await security.getUserToken(formatUrl.createHostname(req), get(formdata, 'applicationId'));

    const fee = await services.feesLookup(data, authToken);
    set(formdata, 'payment.total', fee);
    next();
};

module.exports = lookupFees;
