'use strict';

const pa11y = require('pa11y');
const console = require('console');
const pa11yRun = pa11y({
    hideElements: '.govuk-box-highlight, .govuk-header__logo, .govuk-footer, link[rel=mask-icon], .govuk-skip-link, .govuk-button--start, .govuk-visually-hidden, .govuk-warning-text__assistive',
    log: {
        error: console.error.bind(console)
    }
});

module.exports = (testPage, title) => {
    return new Promise((resolve, reject) => {
        pa11yRun.run(testPage, {
            verifyPage: [
                title
            ],
        }, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
