'use strict';
const appInsights = require('applicationinsights');
const config = require('@hmcts/properties-volume').addTo(require('config'));
const setupSecrets = require('app/setupSecrets');

// Setup secrets before loading the app
setupSecrets();

if (config.appInsights.connectionString) {
    appInsights.setup(config.appInsights.connectionString);
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'probate-frontend';
    appInsights.start();
    appInsights.defaultClient.trackTrace({message: 'App insights activated'});
} else {
    console.log('No app-insights-connection-string present');
}

const app = require('app');

app.init();
