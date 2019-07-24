'use strict';

const {capitalize} = require('lodash');

const updateLookupFormattedAddress = (formattedAddress, postcode) => {
    const postcodeUpdated = postcode.replace(/[A-Z]+/gi, capitalize);
    formattedAddress = formattedAddress.replace(/[A-Z]+('[A-Z])*/gi, capitalize);
    formattedAddress = formattedAddress.replace(postcodeUpdated, postcode);
    formattedAddress = formattedAddress.replace(/(^|,)(\s*)([0-9-.]+[A-Z]*),/gi, '$1$2$3');
    formattedAddress = formattedAddress.replace(/\s*,\s*/g, ',');
    return formattedAddress;
};

module.exports = {
    updateLookupFormattedAddress
};
