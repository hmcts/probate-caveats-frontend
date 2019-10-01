'use strict';

const sanitizer = require('sanitizer');
const traverse = require('traverse');
const emoji = require('node-emoji');
const {flow, unescape} = require('lodash');

const sanitizeRequestBody = (req, res, next) => {
    const santizeValue = flow([emoji.strip, sanitizer.sanitize, unescape]);

    traverse(req.body).forEach(function sanitizeValue(value) {
        if (this.isLeaf && typeof (value) === 'string') {
            const sanitizedValue = santizeValue(value);
            this.update(sanitizedValue);
        }
    });
    next();
};

module.exports = sanitizeRequestBody;
