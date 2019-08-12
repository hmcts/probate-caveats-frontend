'use strict';

const {get, set} = require('lodash');
const formatUrl = require('app/utils/FormatUrl');
const FeesLookup = require('app/utils/FeesLookup');

const lookupFees = async (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const applicantId = formdata.applicantId;
    const hostname = formatUrl.createHostname(req);
    const feesLookup = new FeesLookup(applicantId, hostname);

    feesLookup.lookup()
        .then((res) => {
            set(formdata, 'payment.total', res.fee_amount);
            next();
        });
};

module.exports = lookupFees;
