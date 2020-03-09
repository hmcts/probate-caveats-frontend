'use strict';

const utils = require('app/components/api-utils');
const config = require('config');
const logger = require('app/components/logger');

class FeatureToggle {
    log(message, level = 'info') {
        logger('Init')[level](message);
    }

    async get(featureToggleKey) {
        this.log('Get feature toggle');
        const url = `${config.featureToggles.url}${config.featureToggles.path}/${featureToggleKey}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const fetchOptions = utils.fetchOptions({}, 'GET', headers);
        const result = await utils.fetchText(url, fetchOptions);
        if (result.name === 'Error') {
            return 'false';
        }
        return result;
    }
}

module.exports = FeatureToggle;
