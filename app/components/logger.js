/*global require, module, process */

'use strict';

const {Logger} = require('@hmcts/nodejs-logging');
let logger;

const log = (id) => {
    return (logger) ? logger : Logger.getLogger(`caveat-frontend ${id}`);
};

module.exports = log;
