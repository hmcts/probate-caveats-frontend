'use strict';
const dateformat = require('dateformat');
const submitData = (ctx, formdata) => {

    let body = {"type": "Caveat"};

    let applicant = {};
    body.applicant = applicant;
    applicant.firstName = formdata.applicant.firstName;
    applicant.lastName = formdata.applicant.lastName;
    applicant.email = formdata.applicant.email;

    //TODO This needs to be refactored to produce a full address
    let applicantAddress = {};
    body.applicant.address = applicantAddress;
    applicantAddress.addressLine1 = formdata.applicant.address;

    let deceased = {};
    body.deceased = deceased;
    deceased.firstName = formdata.deceased.firstName;
    deceased.lastName = formdata.deceased.lastName;

    //TODO This needs to be refactored to produce a full address
    if (formdata.deceased.addressknown === 'Yes') {
        let deceasedAddress = {};
        body.deceased.address = deceasedAddress;
        deceasedAddress.addressLine1 = formdata.deceased.address;
    }

    body.deceased.dod_date = dateformat(formdata.deceased.dod_date, 'yyyy-mm-dd');

    if (formdata.deceased.dobknown === 'Yes') {
        body.deceased.dob_date = dateformat(formdata.deceased.dob_date, 'yyyy-mm-dd');
    }

    if (formdata.deceased.alias === 'Yes') {
        body.deceased.otherNames = formdata.deceased.otherNames;
    }

    if (formdata.ccdCase) {
        let ccdCase = {};
        body.ccdCase = formdata.ccdCase;
        ccdCase.id = formdata.ccdCase.id;
        ccdCase.state = formdata.ccdCase.state;
    }

    let registry = {};
    body.registry = registry;
    body.registry.name = getRegistryName(formdata);

    if (formdata.payments) {
        body.payments = formdata.payments;
    }

    body.expirydate = getExpiryDate(formdata);

    return body;
};

//TODO what is the registry allocation algorithum
function getRegistryName(formdata) {
    return 'Birmingham';
}

//TODO what is the expiry date algorithum
function getExpiryDate(formdata) {
    return '2019-06-01';
}

module.exports = submitData;
