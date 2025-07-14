'use strict';

class Sanitize {
    static sanitizeInput(input) {
        const sanitized = {};
        for (const key in input) {
            if (!['__proto__', 'constructor', 'prototype'].includes(key)) {
                sanitized[key] = input[key];
            }
        }
        return sanitized;
    }
}

module.exports = Sanitize;
