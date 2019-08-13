'use strict';

const {Logger} = require('@hmcts/nodejs-logging');
let logger;

const log = (sessionId) => {
    return (logger) ? logger : Logger.getLogger(`caveat-frontend, sessionId: ${sessionId}`);
};

module.exports = log;
