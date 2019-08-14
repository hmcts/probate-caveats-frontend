'use strict';

const {set} = require('lodash');
const formatUrl = require('app/utils/FormatUrl');
const FeesLookup = require('app/utils/FeesLookup');

const lookupPaymentFees = (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const applicantId = formdata.applicantId;
    const hostname = formatUrl.createHostname(req);
    const feesLookup = new FeesLookup(applicantId, hostname);

    feesLookup.lookup(req.authToken)
        .then((res) => {
            set(formdata, 'payment.total', res.total);
            formdata.fees = res;
            session.form = formdata;
            next();
        });
};

module.exports = lookupPaymentFees;
