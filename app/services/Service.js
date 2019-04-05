'use strict';

const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const logger = require('app/components/logger');
const config = require('app/config');
const formatUrl = require('app/utils/FormatUrl');
const AsyncFetch = require('app/utils/AsyncFetch');
const asyncFetch = new AsyncFetch();

class Service {
    constructor(endpoint, sessionId) {
        this.endpoint = endpoint;
        this.sessionId = sessionId;
        this.config = config;
        this.formatUrl = formatUrl;
    }

    get() {
        throw new ReferenceError('get() must be overridden when extending Service');
    }

    post() {
        throw new ReferenceError('post() must be overridden when extending Service');
    }

    patch() {
        throw new ReferenceError('patch() must be overridden when extending Service');
    }

    delete() {
        throw new ReferenceError('delete() must be overridden when extending Service');
    }

    log(message, level = 'info') {
        const sessionId = this.sessionId ? this.sessionId : 'Init';
        logger(sessionId)[level](message);
    }

    replaceEmailInPath(path, email) {
        return path.replace('{applicantEmail}', email);
    }

    fetchJson(url, fetchOptions) {
        return asyncFetch
            .fetch(url, fetchOptions, res => res.json())
            .then(json => json)
            .catch(err => err);
    }

    fetchText(url, fetchOptions) {
        return asyncFetch
            .fetch(url, fetchOptions, res => res.text())
            .then(text => text)
            .catch(err => err);
    }

    fetchBuffer(url, fetchOptions) {
        return asyncFetch
            .fetch(url, fetchOptions, res => res.buffer())
            .then(buffer => buffer)
            .catch(err => {
                this.log(`Fetch buffer error: ${this.formatErrorMessage(err)}`, 'error');
                throw new Error(err);
            });
    }

    fetchOptions(data, method, headers, proxy) {
        if (Object.keys(data).length) {
            data = JSON.stringify(data);
        } else {
            data = null;
        }

        return {
            method: method,
            mode: 'cors',
            redirect: 'follow',
            follow: 10,
            timeout: 10000,
            body: data,
            headers: new fetch.Headers(headers),
            agent: proxy ? new HttpsProxyAgent(proxy) : null
        };
    }

    formatErrorMessage(error) {
        return error.toString();
    }
}

module.exports = Service;
