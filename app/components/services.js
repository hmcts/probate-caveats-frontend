'use strict';

const utils = require('app/components/api-utils');
const config = require('config');
const submitData = require('app/components/submit-data');
const paymentData = require('app/components/payment-data');
const OSPlacesClient = require('@hmcts/os-places-client').OSPlacesClient;
const otp = require('otp');
const FormatUrl = require('app/utils/FormatUrl');
const {URLSearchParams} = require('url');
const ORCHESTRATION_SERVICE_URL = config.services.orchestration.url;
const CREATE_PAYMENT_SERVICE_URL = config.services.payment.createPaymentUrl;
const POSTCODE_SERVICE_TOKEN = config.services.postcode.token;
const SERVICE_AUTHORISATION_URL = `${config.services.idam.s2s_url}/lease`;
const FEES_SERVICE_URL = config.services.feesRegister.url;
const serviceName = config.services.idam.service_name;
const externalHostNameUrl = config.externalHostNameUrl;
const secret = config.services.idam.service_key;
const FEATURE_TOGGLE_URL = config.featureToggles.url;
const logger = require('app/components/logger');
const logError = (message, applicationId = 'Init') => logger(applicationId).error(message);
const logInfo = (message, applicationId = 'Init') => logger(applicationId).info(message);
const osPlacesClient = new OSPlacesClient(POSTCODE_SERVICE_TOKEN);

const findAddress = (postcode) => {
    logInfo('findAddress');
    return new Promise((resolve, reject) => {
        osPlacesClient.lookupByPostcode(postcode)
            .then(res => {
                if (res.valid) {
                    resolve(res.addresses);
                } else {
                    logError('Postcode invalid returning empty list');
                    resolve({});
                }
            })
            .catch(err => {
                logError(`Postcode lookup failed to run: ${err}`);
                reject(new Error('Failed to retrieve address list'));
            });
    });
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
    logInfo('submitToOrchestrationService', data.applicationId);
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': ctx.sessionID,
        'Authorization': ctx.authToken,
        'ServiceAuthorization': ctx.serviceAuthToken
    };
    const body = submitData(ctx, data);
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchJson(`${ORCHESTRATION_SERVICE_URL}/forms/${data.applicationId}/submissions`, fetchOptions);
};

const updateCcdCasePaymentStatus = (data, ctx) => {
    logInfo('update case payment status', data.applicationId);
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': ctx.sessionID,
        'Authorization': ctx.authToken,
        'ServiceAuthorization': ctx.serviceAuthToken
    };
    const body = submitData(ctx, data);
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchJson(`${ORCHESTRATION_SERVICE_URL}/forms/${data.applicationId}/payments`, fetchOptions);
};

const createPayment = (data, hostname, language) => {
    logInfo('createPayment', data.applicationId);
    logInfo('hostname', hostname);
    const paymentUpdatesCallback = config.services.orchestration.url + config.services.orchestration.paths.payment_updates;
    const pay_return_host_url = (hostname.indexOf('.internal') >= 0) ? hostname:(externalHostNameUrl || hostname);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': data.authToken,
        'ServiceAuthorization': data.serviceAuthToken,
        'return-url': FormatUrl.format(pay_return_host_url, config.services.payment.returnUrlPath),
        'service-callback-url': paymentUpdatesCallback
    };
    const body = paymentData.createPaymentData(data, language);
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchJson(CREATE_PAYMENT_SERVICE_URL, fetchOptions);
};

const findPayment = (data, applicationId) => {
    logInfo(`findPayment for id: ${data.paymentId}`, applicationId);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': data.authToken,
        'ServiceAuthorization': data.serviceAuthToken
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    const findPaymentUrl = `${CREATE_PAYMENT_SERVICE_URL}/${data.paymentId}`;
    return utils.fetchJson(findPaymentUrl, fetchOptions);
};

const authorise = (applicationId) => {
    logInfo('authorise for serviceAuthToken called', applicationId);
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

const feesLookup = (data, authToken, applicationId) => {
    logInfo('get fee total', applicationId);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': authToken
    };

    const params = new URLSearchParams(data);
    const url = `${FEES_SERVICE_URL}${config.services.feesRegister.paths.feesLookup}?${params.toString()}`;
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    return utils.fetchJson(url, fetchOptions);
};

module.exports = {
    findAddress,
    sendToOrchestrationService,
    updateCcdCasePaymentStatus,
    createPayment,
    findPayment,
    authorise,
    featureToggle,
    feesLookup
};
