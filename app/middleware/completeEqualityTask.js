'use strict';

const config = require('config');
const get = require('lodash').get;
const uuidv4 = require('uuid/v4');
const Healthcheck = require('app/utils/Healthcheck');
const logger = require('app/components/logger')('Init');

const completeEqualityTask = (params) => {
    if (params.isEnabled && !get(params.req.session.form, 'equality.pcqId', false)) {
        const healthcheck = new Healthcheck();
        const service = {
            name: config.services.equalityAndDiversity.name,
            url: config.services.equalityAndDiversity.url,
            gitCommitIdPath: config.services.equalityAndDiversity.gitCommitIdPath
        };

        healthcheck.getServiceHealth(service)
            .then(json => {
                const equalityHealthIsUp = json.status === 'UP' && json['pcq-backend'].actualStatus === 'UP';
                logger.info(config.services.equalityAndDiversity.name, 'is', (equalityHealthIsUp ? 'UP' : 'DOWN'));

                if (equalityHealthIsUp) {
                    params.req.session.form.equality = {
                        pcqId: uuidv4()
                    };

                    params.next();
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
