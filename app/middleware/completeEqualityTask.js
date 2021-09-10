'use strict';

const config = require('config');
const get = require('lodash').get;
const {v4: uuidv4} = require('uuid');
const featureToggle = new (require('app/utils/FeatureToggle'))();

const completeEqualityTask = (params) => {
    if (params.isEnabled && !get(params.req.session.form, 'equality.pcqId', false)) {
        params.req.session.form.equality = {
            pcqId: uuidv4()
        };

        featureToggle.callCheckToggle(params.req, params.res, params.next, params.res.locals.launchDarkly,
            'ft_pcq_token', featureToggle.toggleFeature);
    } else {
        pcqDown(params);
    }
};

const pcqDown = (params) => {
    params.res.redirect(`${config.app.basePath}/summary`);
};

module.exports = completeEqualityTask;
