'use strict';

const Service = require('./Service');

class FeatureToggle extends Service {
    get(featureToggleKey) {
        this.log('Get feature toggle');
        const url = `${this.endpoint}${this.config.featureToggles.path}/${featureToggleKey}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers);
        return this.fetchText(url, fetchOptions);
    }
}

module.exports = FeatureToggle;
