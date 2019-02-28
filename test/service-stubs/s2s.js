'use strict';

/* eslint no-console: 0 */
// idam service-service auth stub

const express = require('express');
const app = express();
const router = express.Router();
const S2S_STUB_PORT = 4502;

router.post('/lease', (req, res) => {
    console.log(req.headers);
    console.log(req.body);

    res.status(200);
    res.send('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG8v_3ktCpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA');

});

router.get('/health', (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send({'status': 'UP'});
});

app.use(router);

// start the app
console.log(`Listening on: ${S2S_STUB_PORT}`);
const server = app.listen(S2S_STUB_PORT);

module.exports = server;
