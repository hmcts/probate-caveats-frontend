'use strict';

const Step = require('app/core/steps/Step');

class Cookies extends Step {

    static getUrl () {
        return '/cookies';
    }
}

module.exports = Cookies;
