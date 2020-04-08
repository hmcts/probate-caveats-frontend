'use strict';
const setupSecrets = require('app/setupSecrets');

// Setup secrets before loading the app
setupSecrets();

const app = require('app');

app.init();
