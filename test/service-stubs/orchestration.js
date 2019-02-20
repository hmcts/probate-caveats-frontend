'use strict';

/* eslint no-console: 0 */

const config = require('app/config');
const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const ORCHESTRATION_PORT = config.services.orchestration.port;
const CHECK_ANSWERS_PDF_URL = config.services.orchestration.paths.checkanswerspdf;

router.post('/' + CHECK_ANSWERS_PDF_URL, (req, res) => {
    fs.readFile('test/data/checkAnswersSummary.pdf' , function (err, data) {
        res.contentType("application/pdf");
        res.status(200);
        res.send(data);
    });
});

app.use(router);

console.log(`Listening on: ${ORCHESTRATION_PORT}`);
const server = app.listen(ORCHESTRATION_PORT);

module.exports = server;
