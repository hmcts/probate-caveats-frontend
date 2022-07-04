'use strict';
const appInsights = require('applicationinsights');
const config = require('@hmcts/properties-volume').addTo(require('config'));
const setupSecrets = require('app/setupSecrets');

// Setup secrets before loading the app
setupSecrets();

if (config.appInsights.instrumentationKey) {
    appInsights.setup(config.appInsights.instrumentationKey);
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'probate-frontend';
    appInsights.start();
    appInsights.defaultClient.trackTrace({message: 'App insights activated'});
}

const app = require('app');

app.init();
