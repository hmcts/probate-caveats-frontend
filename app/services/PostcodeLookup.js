'use strict';

const axios = require('axios');
const config = require('config');
const logger = require('app/components/logger');

const logError = (message, applicationId = 'Init') => logger(applicationId).error(message);
const logInfo = (message, applicationId = 'Init') => logger(applicationId).info(message);

class PostcodeLookup {

    get(postcode) {
        logInfo(`PostcodeLookup.get postcode: ${postcode}`);
        return axios.get('postcode', {
            baseURL: config.services.postcode.url,
            headers: {
                accept: 'application/json',
            },
            params: {
                key: config.services.postcode.token,
                lr: 'EN',
                postcode,
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
                const isTimeout = err.code === 'ECONNABORTED';
                if (status === 401) {
                    logError('Postcode lookup token is invalid', err);
                    throw new Error('systemError');
                } else if (status >= 500 || isTimeout) {
                    logError('Postcode lookup service outage/timeout', err);
                    throw new Error('systemError');
                } else {
                    logError('Postcode lookup service error', err);
                    throw new Error('systemError');
                }
            });
    }
}

module.exports = PostcodeLookup;
