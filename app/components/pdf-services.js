'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const services = require('app/components/services');
const ORCHESTRATION_SERVICE_URL = config.services.orchestration.url;
const CHECK_ANSWERS_PDF_URL = config.services.orchestration.paths.checkanswerspdf;
const logger = require('app/components/logger');
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);
const security = require('app/components/security');

const createCheckAnswersPdf = (formdata, sessionId, hostname) => {
    logInfo('Create check your answers PDF', sessionId);
    return services.authorise(formdata.applicationId)
        .then(serviceToken => {
            return createPDFDocument(formdata.checkAnswersSummary, serviceToken, body, hostname);
        });
};

function createPDFDocument(formdata, serviceToken, body, hostname) {
    return security.getUserToken(hostname, formdata.applicationId)
        .then((usertoken) => {
            const headers = {
                'Content-Type': 'application/businessdocument+json',
                'Session-Id': formdata.applicationId,
                'Authorization': usertoken,
                'ServiceAuthorization': serviceToken
            };
            const fetchOptions = utils.fetchOptions(body, 'POST', headers);
            return utils.fetchBuffer(`${ORCHESTRATION_SERVICE_URL}/${CHECK_ANSWERS_PDF_URL}`, fetchOptions);
        });
}

module.exports = {
    createCheckAnswersPdf,
};
