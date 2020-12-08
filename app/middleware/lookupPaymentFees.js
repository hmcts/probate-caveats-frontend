'use strict';

const {set} = require('lodash');
const FeesLookup = require('app/utils/FeesLookup');

const lookupPaymentFees = (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const applicationId = formdata.applicationId;
    const feesLookup = new FeesLookup(applicationId, session);

    feesLookup.lookup(req.authToken)
        .then((res) => {
            set(formdata, 'payment.total', res.total);
            formdata.fees = res;
            session.form = formdata;
            next();
        });
};

module.exports = lookupPaymentFees;
