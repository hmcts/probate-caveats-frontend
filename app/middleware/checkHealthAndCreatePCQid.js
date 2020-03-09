'use strict';

const config = require('config');
const Healthcheck = require('app/utils/Healthcheck');
const logger = require('app/components/logger')('Init');
const uuidv4 = require('uuid/v4');

const checkHealthAndCreatePCQid = (req, res, next) => {
    const healthcheck = new Healthcheck();
    const services = [
        {name: config.services.equalityAndDiversity.name, url: config.services.equalityAndDiversity.url}
    ];

    healthcheck.getDownstream(services, healthcheck.health, healthDownstream => {
        req.session.equalityHealth = healthDownstream[0].status;
        logger.info(config.services.equalityAndDiversity.name, 'is', req.session.equalityHealth);

        if (req.session.equalityHealth === 'UP') {
            req.session.form.equality = {
                pcqId: uuidv4()
            };

            next();
        } else {
            res.redirect(`${config.app.basePath}/summary/*`);
        }
    });
};

module.exports = checkHealthAndCreatePCQid;
