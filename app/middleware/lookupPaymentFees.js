'use strict';

const {set} = require('lodash');
const FeesLookup = require('app/utils/FeesLookup');
const services = require('app/components/services');
const security = require('app/components/security');
const logger = require('app/components/logger');
const logInfo = (message, applicationId = 'Unknown') => logger(applicationId).info(message);

const lookupPaymentFees = (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const applicationId = formdata.applicationId;
    const feesLookup = new FeesLookup(applicationId);

    services.authorise(req.session.form.applicationId)
        .then(serviceAuthToken => {
            if (serviceAuthToken.name === 'Error') {
                logInfo('failed to obtain serviceAuthToken', req.session.form.applicationId);
            } else {
                req.serviceAuthToken = serviceAuthToken;

                security.getUserToken(req.session.form.applicationId)
                    .then(authToken => {
                        if (authToken.name === 'Error') {
                            logInfo('failed to obtain authToken', req.session.form.applicationId);
                        } else {
                            req.authToken = authToken;

                            feesLookup.lookup(req.authToken)
                                .then((res) => {
                                    set(formdata, 'payment.total', res.total);
                                    formdata.fees = res;
                                    session.form = formdata;
                                    next();
                                });
                        }
                    })
                    .catch(err => {
                        logInfo('failed to obtain authToken', err);
                    });
            }
        })
        .catch(err => {
            logInfo('failed to obtain serviceAuthToken', err);
        });
};

module.exports = lookupPaymentFees;
