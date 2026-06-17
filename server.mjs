import app from './app.js';
import appInsights from 'applicationinsights';
import config from 'config';
import propertiesVolume from '@hmcts/properties-volume';
import setupSecrets from './app/setupSecrets.js';

const extendedConfig = propertiesVolume.addTo(config);

// Setup secrets before loading the app
setupSecrets();

if (extendedConfig.appInsights.connectionString) {
    appInsights.setup(extendedConfig.appInsights.connectionString)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true, true);
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'probate-frontend';
    appInsights.defaultClient.addTelemetryProcessor(
        (envelope) => !envelope.data.baseData.url?.includes('/health/')
    );
    appInsights.start();
} else {
    console.log('No app-insights-connection-string present');
}

app.init();
