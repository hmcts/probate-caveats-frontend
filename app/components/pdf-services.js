'use strict';

const utils = require('app/components/api-utils');
const config = require('config');
const services = require('app/components/services');
const ORCHESTRATION_SERVICE_URL = config.services.orchestrator.url;
const CHECK_ANSWERS_PDF_URL = config.services.orchestrator.paths.checkanswerspdf;
const logger = require('app/components/logger');
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);
const security = require('app/components/security');

const createCheckAnswersPdf = (formdata, sessionId, hostname) => {
    logInfo('Create check your answers PDF', sessionId);
    return services.authorise(formdata.applicationId)
        .then(serviceToken => {
            return createPDFDocument(formdata, serviceToken, formdata.checkAnswersSummary, hostname);
        });
};

const createPDFDocument = (formdata, serviceToken, body, hostname) => {
    return security.getUserToken(hostname, formdata.applicationId)
        .then((usertoken) => {
            const headers = {
                'Content-Type': 'application/json',
                'Session-Id': formdata.applicationId,
                'Authorization': usertoken,
                'ServiceAuthorization': serviceToken
            };
            const fetchOptions = utils.fetchOptions(body, 'POST', headers);
            return utils.fetchBuffer(`${ORCHESTRATION_SERVICE_URL}/${CHECK_ANSWERS_PDF_URL}`, fetchOptions);
        });
};

module.exports = {
    createCheckAnswersPdf,
};
