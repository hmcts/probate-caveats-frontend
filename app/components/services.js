'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const submitData = require('app/components/submit-data');
const paymentData = require('app/components/payment-data');
const otp = require('otp');
const FormatUrl = require('app/utils/FormatUrl');
const ORCHESTRATION_SERVICE_URL = config.services.orchestration.url;
const POSTCODE_SERVICE_URL = config.services.postcode.url;
const CREATE_PAYMENT_SERVICE_URL = config.services.payment.createPaymentUrl;
const TOKEN = config.services.postcode.token;
const PROXY = config.services.postcode.proxy;
const SERVICE_AUTHORISATION_URL = `${config.services.idam.s2s_url}/lease`;
const serviceName = config.services.idam.service_name;
const secret = config.services.idam.service_key;
const FEATURE_TOGGLE_URL = config.featureToggles.url;
const logger = require('app/components/logger');
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);

const findAddress = (postcode) => {
    logInfo('findAddress');
    const url = `${POSTCODE_SERVICE_URL}?postcode=${encodeURIComponent(postcode)}`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${TOKEN}`
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers, PROXY);
    return utils.fetchJson(url, fetchOptions);
};

const featureToggle = (featureToggleKey) => {
    logInfo('featureToggle');
    const url = `${FEATURE_TOGGLE_URL}${config.featureToggles.path}/${featureToggleKey}`;
    const headers = {
        'Content-Type': 'application/json'
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    return utils.fetchText(url, fetchOptions);
};

const sendToOrchestrationService = (data, ctx) => {
    logInfo('submitToOrchestrationService');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': ctx.sessionID,
        'Authorization': ctx.authToken,
        'ServiceAuthorization': ctx.serviceAuthToken
    };
    const body = submitData(ctx, data);
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchJson(`${ORCHESTRATION_SERVICE_URL}/forms/${data.applicant.email}/submissions`, fetchOptions);
};

const updateCcdCasePaymentStatus = (data, ctx) => {
    logInfo('updateCcdCasePaymentStatus');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': ctx.sessionID,
        'Authorization': ctx.authToken,
        'ServiceAuthorization': ctx.serviceAuthToken
    };
    const body = submitData(ctx, data);
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchJson(`${ORCHESTRATION_SERVICE_URL}/forms/${data.applicant.email}/payments`, fetchOptions);
};

const createPayment = (data, hostname) => {
    logInfo('createPayment');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': data.authToken,
        'ServiceAuthorization': data.serviceAuthToken,
        'return-url': FormatUrl.format(hostname, '/payment-status')
    };
    const body = paymentData.createPaymentData(data);
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchJson(CREATE_PAYMENT_SERVICE_URL, fetchOptions);
};

const findPayment = (data) => {
    logInfo('findPayment');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': data.authToken,
        'ServiceAuthorization': data.serviceAuthToken
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    const findPaymentUrl = `${CREATE_PAYMENT_SERVICE_URL}/${data.paymentId}`;
    return utils.fetchJson(findPaymentUrl, fetchOptions);
};

const authorise = () => {
    logInfo('authorise');
    const headers = {
        'Content-Type': 'application/json'
    };
    const params = {
        microservice: serviceName,
        oneTimePassword: otp({secret: secret}).totp()
    };
    const fetchOptions = utils.fetchOptions(params, 'POST', headers);
    return utils.fetchText(SERVICE_AUTHORISATION_URL, fetchOptions);
};

module.exports = {
    findAddress,
    sendToOrchestrationService,
    updateCcdCasePaymentStatus,
    createPayment,
    findPayment,
    authorise,
    featureToggle
};
