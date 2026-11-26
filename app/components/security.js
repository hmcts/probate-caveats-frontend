'use strict';

const utils = require('app/components/api-utils');
const config = require('config');
const logger = require('app/components/logger');
const logInfo = (message, applicationId = 'Unknown') => logger(applicationId).info(message);
const {URLSearchParams} = require('url');
const FormatUrl = require('app/utils/FormatUrl');

const getUserToken = (hostname, applicationId) => {
    const redirect_url = FormatUrl.format(hostname, config.services.idam.caveat_redirectUrl);
    return getOpenIdToken(redirect_url, applicationId)
        .then((result) => {
            checkForError(result);
            return result.access_token;
        })
        .catch((err) => err);
};

const getOpenIdToken = (redirect_url, applicationId) => {
    logInfo('calling getOpenIdToken to get auth token', applicationId);
    const client_id = config.services.idam.probate_oauth2_client;
    const client_secret = config.services.idam.probate_oauth2_secret;
    const idam_api_url = config.services.idam.apiUrl;
    const redirect_uri = redirect_url;
    const username = config.services.idam.caveat_user_email;
    const userpassword = config.services.idam.caveat_user_password;
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('scope', 'openid profile roles');
    params.append('redirect_uri', redirect_uri);
    params.append('client_id', client_id);
    params.append('client_secret', client_secret);
    params.append('username', username);
    params.append('password', userpassword);

    return utils.fetchJson(`${idam_api_url}/o/token`, {
        method: 'POST',
        timeout: 10000,
        body: params.toString(),
        headers: headers
    });
};

const checkForError = (result) => {
    if (result.name === 'Error') {
        throw result;
    }
};

module.exports = {
    getUserToken
};
