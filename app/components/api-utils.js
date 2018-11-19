'use strict';

const logger = require('app/components/logger')('Init');
const {endsWith} = require('lodash');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const config = require('app/config');

const buildRequest = (url, fetchOptions) => {
    return new fetch.Request(url, fetchOptions);
};

const retryOptions = () => {
    return {
        retries: config.utils.api.retries,
        retryDelay: config.utils.api.retryDelay
    };
};

const asyncFetch = (url, fetchOptions, parseBody) => {
    if (!endsWith(url, 'health')) {
        logger.info('Calling external service');
    }

    return new Promise((resolve, reject) => {
        const asyncReq = buildRequest(url, fetchOptions);
        fetch(asyncReq, retryOptions())
            .then(res => {
                if (!endsWith(url, 'health')) {
                    logger.info(`Status: ${res.status}`);
                }
                if (res.ok) {
                    return parseBody(res);
                }
                logger.error(res.statusText);
                return parseBody(res)
                    .then(body => {
                        logger.error(body);
                        reject(new Error(res.statusText));
                    });

            })
            .then(body => {
                resolve(body);
            })
            .catch(err => {
                logger.error(`Error${err}`);
                reject(Error(err));
            });
    });
};

const fetchJson = (url, fetchOptions) => {
    return asyncFetch(url, fetchOptions, res => res.json())
        .then(json => json)
        .catch(err => err);
};

const fetchText = (url, fetchOptions) => {
    return asyncFetch(url, fetchOptions, res => res.text())
        .then(text => text)
        .catch(err => err);
};

const fetchOptions = (data, method, headers, proxy) => {
    return {
        method: method,
        mode: 'cors',
        redirect: 'follow',
        follow: 10,
        timeout: 10000,
        body: JSON.stringify(data),
        headers: new fetch.Headers(headers),
        agent: proxy ? new HttpsProxyAgent(proxy) : null
    };
};

module.exports = {
    fetchOptions: fetchOptions,
    fetchJson: fetchJson,
    asyncFetch: asyncFetch,
    fetchText: fetchText
};
