'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const submitData = require('app/components/submit-data');
const paymentData = require('app/components/payment-data');
const otp = require('otp');
const {URLSearchParams} = require('url');
const FormatUrl = require('app/utils/FormatUrl');
const IDAM_SERVICE_URL = config.services.idam.apiUrl;
const VALIDATION_SERVICE_URL = config.services.validation.url;
const SUBMIT_SERVICE_URL = config.services.submit.url;
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

const validateFormData = (data, sessionID) => {
    logInfo('validateFormData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const fetchOptions = utils.fetchOptions({formdata: data}, 'POST', headers);
    return utils.fetchJson(`${VALIDATION_SERVICE_URL}`, fetchOptions);
};

const sendToSubmitService = (data, ctx, softStop) => {
    logInfo('sendToSubmitService');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': ctx.sessionID,
        'Authorization': ctx.authToken,
        'UserId': ctx.userId
    };
    const body = submitData(ctx, data);
    body.softStop = softStop;
    body.applicantEmail = data.applicantEmail;
    const fetchOptions = utils.fetchOptions({submitdata: body}, 'POST', headers);
    return utils.fetchJson(`${SUBMIT_SERVICE_URL}/submit`, fetchOptions);
};

const updateCcdCasePaymentStatus = (data, ctx) => {
    logInfo('updateCcdCasePaymentStatus');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': ctx.sessionID,
        'Authorization': ctx.authToken,
        'UserId': ctx.userId
    };
    const body = submitData(ctx, data);
    const fetchOptions = utils.fetchOptions({submitdata: body}, 'POST', headers);
    return utils.fetchJson(`${SUBMIT_SERVICE_URL}/updatePaymentStatus`, fetchOptions);
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
    return [utils.fetchJson(CREATE_PAYMENT_SERVICE_URL, fetchOptions), body.reference];
};

const findPayment = (data) => {
    logInfo('findPayment');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': data.authToken,
        'ServiceAuthorization': data.serviceAuthToken
    };

    const fetchOptions = utils.fetchOptions(data, 'GET', headers);
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

const getOauth2Token = (code, redirectUri) => {
    logInfo('calling oauth2 token');
    const clientName = config.services.idam.probate_oauth2_client;
    const secret = config.services.idam.probate_oauth2_secret;
    const idam_api_url = config.services.idam.apiUrl;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${new Buffer(`${clientName}:${secret}`).toString('base64')}`
    };

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    return utils.fetchJson(`${idam_api_url}/oauth2/token`, {
        method: 'POST',
        timeout: 10000,
        body: params.toString(),
        headers: headers
    });
};

const signOut = (access_token) => {
    logInfo('signing out of IDAM');
    const clientName = config.services.idam.probate_oauth2_client;
    const headers = {
        'Authorization': `Basic ${new Buffer(`${clientName}:${secret}`).toString('base64')}`,
    };
    const fetchOptions = utils.fetchOptions({}, 'DELETE', headers);
    return utils.fetchJson(`${IDAM_SERVICE_URL}/session/${access_token}`, fetchOptions);
};

module.exports = {
    findAddress,
    featureToggle,
    validateFormData,
    sendToSubmitService,
    updateCcdCasePaymentStatus,
    createPayment,
    findPayment,
    authorise,
    getOauth2Token,
    signOut,
};
