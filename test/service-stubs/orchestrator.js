'use strict';

/* eslint no-console: 0 */

const config = require('config');
const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const ORCHESTRATION_PORT = config.services.orchestrator.port;
const CHECK_ANSWERS_PDF_URL = config.services.orchestrator.paths.checkanswerspdf;

router.post('/' + CHECK_ANSWERS_PDF_URL, (req, res) => {
    fs.readFile('test/data/checkAnswersSummary.pdf', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.contentType('application/pdf');
            res.status(200);
            res.send(data);
        }
    });
});

router.post('/forms/*/submissions', (req, res) => {
    fs.readFile('test/data/full-caveat-form.json', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.contentType('application/json');
            res.status(200);
            res.send(data);
        }
    });
});

router.post('/forms/*/payments', (req, res) => {
    res.contentType('application/json');
    res.status(200);
    res.send({caseState: 'newState'});
});

router.get('/health', (req, res) => {
    res.send({'status': 'UP'});
});

router.get('/info', (req, res) => {
    res.send({
        'git': {
            'commit': {
                'time': '2018-06-05T16:31+0000',
                'id': 'e210e75b38c6b8da03551b9f83fd909fe80832e3'
            }
        }
    });
});

app.use(router);

console.log(`Listening on: ${ORCHESTRATION_PORT}`);
const server = app.listen(ORCHESTRATION_PORT);

module.exports = server;
