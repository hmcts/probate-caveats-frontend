'use strict';

const Step = require('app/core/steps/Step');

class ShutterPage extends Step {
    static getUrl() {
        return '/offline';
    }
}

module.exports = ShutterPage;
