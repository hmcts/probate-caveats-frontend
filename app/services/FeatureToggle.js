'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const logger = require('app/components/logger');
const logInfo = (message, applicationId = 'Init') => logger(applicationId).info(message);

class FeatureToggle {
    get(featureToggleKey) {
        logInfo('Get feature toggle');
        const url = `${config.featureToggles.url}${config.featureToggles.path}/${featureToggleKey}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const fetchOptions = utils.fetchOptions({}, 'GET', headers);
        return utils.fetchText(url, fetchOptions);
    }
}

module.exports = FeatureToggle;
