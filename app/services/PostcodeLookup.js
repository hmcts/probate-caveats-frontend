'use strict';

const axios = require('axios');
const config = require('config');
const logger = require('app/components/logger');

const logError = (message, applicationId = 'Init') => logger(applicationId).error(message);
const logInfo = (message, applicationId = 'Init') => logger(applicationId).info(message);

class PostcodeLookup {

    get(postcode) {
        const normalisedPostcode = postcode?.trim();
        if (!normalisedPostcode) {
            logInfo('No postcode supplied, returning empty list');
            return Promise.resolve([]);
        }
        logInfo('PostcodeLookup.get postcode: performing postcode lookup');
        return axios.get('postcode', {
            baseURL: config.services.postcode.url,
            headers: {
                accept: 'application/json',
            },
            params: {
                key: config.services.postcode.token,
                lr: 'EN',
                postcode: normalisedPostcode,
            },
        })
            .then(response => {
                if (!response.data?.results) {
                    logInfo('No results found for postcode, returning empty list');
                    return [];
                }

                return response.data.results.map(({DPA}) => {
                    const {
                        ADDRESS,
                        POSTCODE,
                    } = DPA;

                    return {
                        formattedAddress: ADDRESS,
                        postcode: POSTCODE,
                    };
                });
            })
            .catch(err => {
                const status = err.response?.status;
                const isTimeout = ['ECONNABORTED', 'ETIMEDOUT'].includes(err.code);
                if (status === 400 || status === 404) {
                    logInfo(`Postcode lookup rejected invalid input, returning empty list. Status: ${status}`);
                    return [];
                }
                if (status === 401 || status === 403) {
                    logError(`Postcode lookup token is invalid. Status: ${status}; error: ${err.message}`);
                    throw new Error('systemError');
                }
                if (status >= 500 || isTimeout) {
                    logError(`Postcode lookup service outage/timeout. Status: ${status}; error: ${err.message}`);
                    throw new Error('systemError');
                }
                logError(`Postcode lookup service error. Status: ${status}; error: ${err.message}`);
                throw new Error('systemError');
            });
    }
}

module.exports = PostcodeLookup;
