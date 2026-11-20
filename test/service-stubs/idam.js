'use strict';

/* eslint no-console: 0 */
// idam service-service auth stub

const express = require('express');
const app = express();
const router = express.Router();
const IDAM_STUB_PORT = 4501;

router.post('/oauth2/authorize', (req, res) => {
    res.status(200);
    res.send({code: 'codeValue'});

});

router.post('/oauth2/token', (req, res) => {
    res.status(200);
    res.send({access_token: 'accessToken'});

});

router.get('/health', (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send({'status': 'UP'});
});

app.use(router);

// start the app
console.log(`Listening on: ${IDAM_STUB_PORT}`);
const server = app.listen(IDAM_STUB_PORT);

module.exports = server;
