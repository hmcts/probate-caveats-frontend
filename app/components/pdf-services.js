'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const services = require('app/components/services');
const ORCHESTRATION_SERVICE_URL = config.services.orchestration.url;
const CHECK_ANSWERS_PDF_URL = config.services.orchestration.paths.checkanswerspdf;
const logger = require('app/components/logger');
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);

const createCheckAnswersPdf = (formdata, sessionId) => {
    logInfo('Create check your answers PDF', sessionId);
    return services.authorise()
        .then(serviceToken => {
            const body = {
                checkAnswersSummary: formdata.checkAnswersSummary
            };
            return createPDFDocument(formdata, serviceToken, body);
        });
};

function createPDFDocument(formdata, serviceToken, body) {
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': formdata.applicantEmail,
        'Authorization': config.app.authorization,
        'ServiceAuthorization': serviceToken
    };
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchBuffer(`${ORCHESTRATION_SERVICE_URL}/${CHECK_ANSWERS_PDF_URL}`, fetchOptions);
}

module.exports = {
    createCheckAnswersPdf,
};
