'use strict';

const config = require('config');
const get = require('lodash').get;
// const Healthcheck = require('app/utils/Healthcheck');
// const logger = require('app/components/logger')('Init');
const uuidv4 = require('uuid/v4');

const completeEqualityTask = (params) => {
    // const healthcheck = new Healthcheck();
    // const services = [
    //     {name: config.services.equalityAndDiversity.name, url: config.services.equalityAndDiversity.url}
    // ];
    //
    // healthcheck.getDownstream(services, healthcheck.health, healthDownstream => {
    //     params.req.session.equalityHealth = healthDownstream[0].status;
    //     logger.info(config.services.equalityAndDiversity.name, 'is', params.req.session.equalityHealth);
    //
    //     if (params.req.session.equalityHealth === 'UP') {
    //         params.req.session.form.equality = {
    //             pcqId: uuidv4()
    //         };
    //
    //         params.next();
    //     } else {
    //         params.res.redirect(`${config.app.basePath}/summary`);
    //     }
    // });

    if (params.isEnabled && !get(params.req.session.form, 'equality.pcqId', false)) {
        params.req.session.form.equality = {
            pcqId: uuidv4()
        };

        params.next();
    } else {
        params.res.redirect(`${config.app.basePath}/summary`);
    }
};

module.exports = completeEqualityTask;
