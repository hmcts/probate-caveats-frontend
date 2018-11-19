/*global require, module, process */

'use strict';

const {Logger} = require('@hmcts/nodejs-logging');
let logger;

const log = () => {
    return (logger) ? logger : Logger.getLogger('eligibility-frontend');
};

module.exports = log;
