'use strict';
const setupSecrets = require('setupSecrets');

// Setup secrets before loading the app
setupSecrets();

const app = require('app');

app.init();
