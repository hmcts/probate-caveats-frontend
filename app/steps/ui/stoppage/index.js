'use strict';

const Step = require('app/core/steps/Step');

class StopPage extends Step {

    static getUrl(reason = '*') {
        return `/stop-page/${reason}`;
    }
}

module.exports = StopPage;
