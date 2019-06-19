'use strict';

const {capitalize} = require('lodash');

const updateLookupFormattedAddress = (formattedAddress, postcode) => {
    const postcodeUpdated = postcode.replace(/\w+/g, capitalize);
    formattedAddress = formattedAddress.replace(/\w+/g, capitalize);
    formattedAddress = formattedAddress.replace(postcodeUpdated, postcode);
    formattedAddress = formattedAddress.replace(/(^|,)(\s*)([0-9-.]+),/g, '$1$2$3');
    formattedAddress = formattedAddress.replace(/\s*,\s*/g, ',');
    return formattedAddress;
};

module.exports = {
    updateLookupFormattedAddress
};
