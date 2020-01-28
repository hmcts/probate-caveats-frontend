'use strict';

const pa11y = require('pa11y');
const console = require('console');

module.exports = (testPage) => {
    return new Promise((resolve, reject) => {
        pa11y(testPage, {
            hideElements: '.govuk-box-highlight, .govuk-header__logo, .govuk-footer, link[rel=mask-icon], .govuk-skip-link, .govuk-button--start, .govuk-visually-hidden, .govuk-warning-text__assistive, iframe, #ctsc-web-chat',
            log: {
                error: console.error.bind(console),
                info: console.error.bind(console),
                debug: console.error.bind(console)
            }
        }, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
