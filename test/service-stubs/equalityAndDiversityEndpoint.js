'use strict';

const config = require('config');
const express = require('express');
const router = require('express').Router();
const logger = require('app/components/logger')('Init');
const app = express();
const equalityPath = config.services.equalityAndDiversity.path;
const equalityPort = config.services.equalityAndDiversity.port;

app.use(express.json());

app.post(equalityPath, (req, res) => {
    logger.info(req.body);
    res.send({status: 'OK', body: req.body});
});

app.use(router);

logger.info(`Listening on: ${equalityPort}`);

const server = app.listen(equalityPort);

module.exports = server;
