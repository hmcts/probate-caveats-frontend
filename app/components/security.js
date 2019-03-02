'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const logger = require('app/components/logger');
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);
const {URLSearchParams} = require('url');

const getUserToken = () => {
    logInfo('calling getUserToken to get code and token for user');
    return getOauth2Code()
        .then((result) => {
            checkForError(result);
            return getOauth2Token(result.code)
                .then((result) => {
                    checkForError(result);
                    return result.access_token;
                });
        });
};

const getOauth2Code = () => {
    logInfo('calling getOauth2Code to get code');
    const client_id = config.services.idam.probate_oauth2_client;
    const idam_api_url = config.services.idam.apiUrl;
    const redirect_uri = config.services.idam.caveat_redirectUrl;
    const username = config.services.idam.caveat_user_email;
    const userpassword = config.services.idam.caveat_user_password;
    logInfo('redirect_url: ' + redirect_uri);
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

const getOauth2Token = (code) => {
    logInfo('calling getOauth2Token to get user token');
    const client_id = config.services.idam.probate_oauth2_client;
    const client_secret = config.services.idam.probate_oauth2_secret;
    const idam_api_url = config.services.idam.apiUrl;
    const redirect_uri = config.services.idam.caveat_redirectUrl;

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
        throw new Error(result.message);
    }
}

module.exports = {
    getUserToken
};
