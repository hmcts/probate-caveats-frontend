'use strict';

const pa11y = require('pa11y');

module.exports = (testPage) => {
    return new Promise((resolve, reject) => {
        pa11y(testPage, {
            includeWarnings: true,
            hideElements: '.govuk-box-highlight, .govuk-header__logo, .govuk-footer, link[rel=mask-icon], .govuk-skip-link, .govuk-button--start, .govuk-visually-hidden, .govuk-warning-text__assistive, iframe, #ctsc-web-chat, .govuk-warning-text__icon, div[style*="position: fixed;"]',
        }, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
