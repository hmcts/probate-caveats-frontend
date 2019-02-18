'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const services = require('app/components/services');
const ORCHESTRATION_SERVICE_URL = config.services.orchestration.url;
const logger = require('app/components/logger');
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);

const createCheckAnswersPdf = (formdata, sessionId) => {
    logInfo('Create check your answers PDF', sessionId);
    return services.authorise()
        .then(serviceToken => {
            const body = {
                checkAnswersSummary: formdata.checkAnswersSummary
            };
            return createPDFDocument(formdata, serviceToken, body, 'generateCheckAnswersSummaryPDF');
        });
};

function createPDFDocument(formdata, serviceToken, body, pdfTemplate) {
    const headers = {
        'Content-Type': 'application/json',
        'ServiceAuthorization': serviceToken
    };
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchBuffer(`${ORCHESTRATION_SERVICE_URL}/` + pdfTemplate, fetchOptions);
}

module.exports = {
    createCheckAnswersPdf,
};
