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
const PERSISTENCE_SERVICE_URL = config.services.persistence.url;
const CREATE_PAYMENT_SERVICE_URL = config.services.payment.createPaymentUrl;
const TOKEN = config.services.postcode.token;
const PROXY = config.services.postcode.proxy;
const SERVICE_AUTHORISATION_URL = `${config.services.idam.s2s_url}/lease`;
const serviceName = config.services.idam.service_name;
const secret = config.services.idam.service_key;
const FEATURE_TOGGLE_URL = config.featureToggles.url;
const logger = require('app/components/logger');
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);

const getUserDetails = (securityCookie) => {
    logInfo('getUserDetails');
    const url = `${IDAM_SERVICE_URL}/details`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${securityCookie}`
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    return utils.fetchJson(url, fetchOptions);
};

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

const loadFormData = (id, sessionID) => {
    logInfo('loadFormData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    logInfo(`loadFormData url: ${PERSISTENCE_SERVICE_URL}/${id}`);
    return utils.fetchJson(`${PERSISTENCE_SERVICE_URL}/${id}`, fetchOptions);
};

const saveFormData = (id, data, sessionID) => {
    logInfo('saveFormData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const body = {
        id: id,
        formdata: data,
        submissionReference: data.submissionReference
    };
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchJson(`${PERSISTENCE_SERVICE_URL}`, fetchOptions);
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

const findInviteLink = (inviteId) => {
    logInfo('find invite link');
    const findInviteLinkUrl = FormatUrl.format(PERSISTENCE_SERVICE_URL, `/invitedata/${inviteId}`);
    const fetchOptions = utils.fetchOptions({}, 'GET', {});
    return utils.fetchJson(findInviteLinkUrl, fetchOptions);
};

const updateInviteData = (inviteId, data) => {
    logInfo('update invite');
    const findInviteLinkUrl = FormatUrl.format(PERSISTENCE_SERVICE_URL, `/invitedata/${inviteId}`);
    const headers = {
        'Content-Type': 'application/json'
    };
    const fetchOptions = utils.fetchOptions(data, 'PATCH', headers);
    return utils.fetchJson(findInviteLinkUrl, fetchOptions);
};

const sendInvite = (data, sessionID, exec) => {
    logInfo('send invite');
    const urlParameter = exec.inviteId ? `/${exec.inviteId}` : '';
    const sendInviteUrl = FormatUrl.format(VALIDATION_SERVICE_URL, `/invite${urlParameter}`);
    const headers = {'Content-Type': 'application/json', 'Session-Id': sessionID};
    const fetchOptions = utils.fetchOptions(data, 'POST', headers);
    return utils.fetchText(sendInviteUrl, fetchOptions);
};

const checkAllAgreed = (formdataId) => {
    logInfo('check all agreed');
    const allAgreedUrl = FormatUrl.format(VALIDATION_SERVICE_URL, `/invites/allAgreed/${formdataId}`);
    const fetchOptions = utils.fetchOptions({}, 'GET', {});
    return utils.fetchText(allAgreedUrl, fetchOptions);
};

const sendPin = (phoneNumber, sessionID) => {
    logInfo('send pin');
    phoneNumber = encodeURIComponent(phoneNumber);
    const pinServiceUrl = FormatUrl.format(VALIDATION_SERVICE_URL, `/pin?phoneNumber=${phoneNumber}`);
    const fetchOptions = utils.fetchOptions({}, 'GET', {'Content-Type': 'application/json', 'Session-Id': sessionID});
    return utils.fetchJson(pinServiceUrl, fetchOptions);
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

const removeExecutor = (inviteId) => {
    logInfo('Removing executor from invitedata table');
    const removeExecutorUrl = FormatUrl.format(PERSISTENCE_SERVICE_URL, `/invitedata/${inviteId}`);
    const fetchOptions = utils.fetchOptions({}, 'DELETE', {});
    return utils.fetchText(removeExecutorUrl, fetchOptions);
};

const updateContactDetails = (inviteId, data) => {
    logInfo('Update Contact Details');
    const findInviteUrl = FormatUrl.format(PERSISTENCE_SERVICE_URL, `/invitedata/${inviteId}`);
    const headers = {
        'Content-Type': 'application/json'
    };
    const fetchOptions = utils.fetchOptions(data, 'PATCH', headers);
    return utils.fetchJson(findInviteUrl, fetchOptions);
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

const uploadDocument = (sessionId) => {
    logInfo('Uploading document', sessionId);
    return true;
};

module.exports = {
    getUserDetails,
    findAddress,
    featureToggle,
    validateFormData,
    sendToSubmitService,
    updateCcdCasePaymentStatus,
    loadFormData,
    saveFormData,
    createPayment,
    findPayment,
    findInviteLink,
    updateInviteData,
    authorise,
    getOauth2Token,
    sendPin,
    sendInvite,
    updateContactDetails,
    removeExecutor,
    checkAllAgreed,
    signOut,
    uploadDocument
};
