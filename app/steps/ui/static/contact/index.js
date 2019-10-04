'use strict';

const Step = require('app/core/steps/Step');

class ContactUs extends Step {

    static getUrl() {
        return '/contact-us';
    }
}

module.exports = ContactUs;
