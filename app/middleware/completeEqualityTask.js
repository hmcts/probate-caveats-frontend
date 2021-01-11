'use strict';

const config = require('config');
const get = require('lodash').get;
const {v4: uuidv4} = require('uuid');
const {fetchOptions, fetchJson} = require('app/components/api-utils');
const FormatUrl = require('app/utils/FormatUrl');
const logger = require('app/components/logger')('Init');
const featureToggle = new (require('app/utils/FeatureToggle'))();

const completeEqualityTask = (params) => {
    if (params.isEnabled && !get(params.req.session.form, 'equality.pcqId', false)) {
        const fetchOpts = fetchOptions({}, 'GET', {});
        fetchJson(FormatUrl.format(config.services.equalityAndDiversity.url, config.endpoints.health), fetchOpts)
            .then(json => {
                const equalityHealthIsUp = json.status === 'UP' && json['pcq-backend'].actualStatus === 'UP';
                logger.info(config.services.equalityAndDiversity.name, 'is', (equalityHealthIsUp ? 'UP' : 'DOWN'));

                if (equalityHealthIsUp) {
                    params.req.session.form.equality = {
                        pcqId: uuidv4()
                    };

                    featureToggle.callCheckToggle(params.req, params.res, params.next, params.res.locals.launchDarkly,
                        'ft_pcq_token', featureToggle.toggleFeature);

                } else {
                    pcqDown(params);
                }
            });
    } else {
        pcqDown(params);
    }
};

const pcqDown = (params) => {
    params.res.redirect(`${config.app.basePath}/summary`);
};

module.exports = completeEqualityTask;
