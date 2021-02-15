'use strict';

const logger = require('app/components/logger')('Init');
const {endsWith} = require('lodash');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const config = require('config');

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
    const isHealthOrInfo = endsWith(url, 'health') || endsWith(url, 'info');

    if (!isHealthOrInfo) {
        logger.info('Calling external service');
    }

    return new Promise((resolve, reject) => {
        const asyncReq = buildRequest(url, fetchOptions);
        fetch(asyncReq, retryOptions())
            .then(res => {
                if (!isHealthOrInfo) {
                    logger.info(`Status: ${res.status}`);
                }
                if (res.ok) {
                    return parseBody(res);
                }
                logger.error(res.statusText);
                return parseBody(res)
                    .then(body => {
                        if (body instanceof Buffer) {
                            logger.error(body.toLocaleString());
                        } else {
                            logger.error(body);
                        }
                        reject(new Error(res.statusText));
                    });
            })
            .then(body => {
                resolve(body);
            })
            .catch(err => {
                logger.error(`${err}`);
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

const fetchBuffer = (url, fetchOptions) => {
    return asyncFetch(url, fetchOptions, res => res.buffer())
        .then(buffer => buffer)
        .catch(err => {
            logger.error(`Error${err}`);
            throw (err);
        });
};

const fetchOptions = (data, method, headers, proxy) => {
    return {
        method: method,
        mode: 'cors',
        redirect: 'follow',
        follow: 10,
        timeout: config.utils.api.timeout,
        body: method === 'POST' ? JSON.stringify(data) : null,
        headers: new fetch.Headers(headers),
        agent: proxy ? new HttpsProxyAgent(proxy) : null
    };
};

module.exports = {
    fetchOptions: fetchOptions,
    fetchJson: fetchJson,
    asyncFetch: asyncFetch,
    fetchText: fetchText,
    fetchBuffer: fetchBuffer
};
