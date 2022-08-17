'use strict';

const healthcheck = require('@hmcts/nodejs-healthcheck');
const config = require('config');
const logger = require('app/components/logger')('Init');

const healthOptions = {
    callback: (error, res) => { // eslint-disable-line id-blacklist
        if (error) {
            logger.info('Health check failed!');
        }
        return res.body.status === 'good' ? healthcheck.up() : healthcheck.down();
    },
    timeout: config.health.timeout,
    deadline: config.health.deadline
};

module.exports = healthOptions;
