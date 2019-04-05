'use strict';

const config = require('app/config');
const express = require('express');
const router = require('express').Router();
const logger = require('app/components/logger')('Init');
const app = express();
const persistenceServicePort = config.services.persistence.port;

router.get(`${config.featureToggles.path}/:featureToggleKey`, (req, res) => {
    res.send('true');
});

app.use(router);

logger.info(`Listening on: ${persistenceServicePort}`);

const server = app.listen(persistenceServicePort);

module.exports = server;
