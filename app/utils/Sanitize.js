'use strict';

class Sanitize {
    static sanitizeInput(input) {
        if (input === null) {
            return input;
        }
        if (typeof input !== 'object') {
            return {};
        }
        if (Array.isArray(input)) {
            return input;
        }

        const sanitized = {};

        for (const key of Object.keys(input)) {
            if (!['__proto__', 'constructor', 'prototype'].includes(key)) {
                sanitized[key] = input[key];
            }
        }
        return sanitized;
    }
}

module.exports = Sanitize;
