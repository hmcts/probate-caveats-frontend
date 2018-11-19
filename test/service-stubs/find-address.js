'use strict';

/* eslint no-console: 0 */

const config = require('app/config');
const express = require('express');
const app = express();
const router = require('express').Router();
const validData = require('test/data/find-address');
const FIND_ADDRESS_PORT = config.services.postcode.port;
const FIND_ADDRESS_PATH = config.services.postcode.path;

router.get(FIND_ADDRESS_PATH, (req, res) => {
    const data = req.query.postcode === 'VALID' ? validData : [];
    res.status(200);
    res.send(data);
});

app.use(router);

console.log(`Listening on: ${FIND_ADDRESS_PORT}`);
const server = app.listen(FIND_ADDRESS_PORT);

module.exports = server;
