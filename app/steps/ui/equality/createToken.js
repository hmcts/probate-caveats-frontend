'use strict';

const crypto = require('crypto');
const config = require('config');
const logger = require('app/components/logger')('Init');

const algorithm = 'aes-256-cbc';
const iv = Buffer.alloc(16, 0); // Initialization vector.

const createToken = (params) => {
    const tokenKey = config.services.equalityAndDiversity.tokenKey;
    let encrypted;

    if (tokenKey) {
        logger.info(`Using ${tokenKey === 'PROBATE_TOKEN_KEY' ? 'local' : 'Azure KV'} secret for PCQ token key`);
        const key = crypto.scryptSync(tokenKey, 'salt', 32);
        // Convert all params to string before encrypting
        Object.keys(params).forEach(p => {
            params[p] = String(params[p]);
        });
        const strParams = JSON.stringify(params);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        encrypted = cipher.update(strParams, 'utf8', 'hex');
        encrypted += cipher.final('hex');
    } else {
        logger.error('PCQ token key is missing.');
    }

    return encrypted;
};

module.exports = createToken;
