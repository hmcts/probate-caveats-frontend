'use strict';

const utils = require('app/components/api-utils');
const config = require('config');
const logger = require('app/components/logger');
const logInfo = (message, applicationId = 'Unknown') => logger(applicationId).info(message);
const {URLSearchParams} = require('url');
const FormatUrl = require('app/utils/FormatUrl');

const getUserToken = (hostname, applicationId) => {
    const redirect_url = FormatUrl.format(config.services.idam.caveat_redirect_base_url, config.services.idam.caveat_redirectUrl);
    return getOauth2Code(redirect_url, applicationId)
        .then((result) => {
            checkForError(result);
            return getOauth2Token(result.code, redirect_url, applicationId);
        })
        .then((result) => {
            checkForError(result);
            return result.access_token;
        })
        .catch((err) => err);
};

const getOauth2Code = (redirect_url, applicationId) => {
    logInfo('calling getOauth2Code to get code', applicationId);
    const client_id = config.services.idam.probate_oauth2_client;
    const idam_api_url = config.services.idam.apiUrl;
    const redirect_uri = redirect_url;
    const username = config.services.idam.caveat_user_email;
    const userpassword = config.services.idam.caveat_user_password;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${new Buffer(`${username}:${userpassword}`).toString('base64')}`
    };
    const params = new URLSearchParams();
    params.append('client_id', client_id);
    params.append('redirect_uri', redirect_uri);
    params.append('response_type', 'code');

    return utils.fetchJson(`${idam_api_url}/oauth2/authorize`, {
        method: 'POST',
        timeout: 10000,
        body: params.toString(),
        headers: headers
    });
};

const getOauth2Token = (code, redirect_url, applicationId) => {
    logInfo('calling getOauth2Token to get auth token', applicationId);
    const client_id = config.services.idam.probate_oauth2_client;
    const client_secret = config.services.idam.probate_oauth2_secret;
    const idam_api_url = config.services.idam.apiUrl;
    const redirect_uri = redirect_url;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirect_uri);
    params.append('client_id', client_id);
    params.append('client_secret', client_secret);

    return utils.fetchJson(`${idam_api_url}/oauth2/token`, {
        method: 'POST',
        timeout: 10000,
        body: params.toString(),
        headers: headers
    });
};

function checkForError(result) {
    if (result.name === 'Error') {
        throw result;
    }
}

module.exports = {
    getUserToken
};
