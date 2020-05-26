'use strict';

const config = require('config');
const express = require('express');
const router = require('express').Router();
const logger = require('app/components/logger')('Init');
const app = express();
const equalityPort = config.services.equalityAndDiversity.port;

app.use(express.json());

app.get('/health', (req, res) => {
    logger.info(req.body);
    res.send({
        status: 'UP',
        'pcq-backend': {
            actualStatus: 'UP'
        }
    });
});

router.get('/info', (req, res) => {
    res.send({
        'git': {
            'commit': {
                'time': '2018-06-05T16:31+0000',
                'id': 'e210e75b38c6b8da03551b9f83fd909fe80832e4'
            }
        }
    });
});

app.use(router);

logger.info(`Listening on: ${equalityPort}`);

const server = app.listen(equalityPort);

module.exports = server;
