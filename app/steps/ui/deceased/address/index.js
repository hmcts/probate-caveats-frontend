'use strict';

const AddressStep = require('app/core/steps/AddressStep');

class DeceasedAddress extends AddressStep {

    static getUrl() {
        return '/deceased-address';
    }
}

module.exports = DeceasedAddress;
