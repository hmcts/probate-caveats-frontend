'use strict';
/*eslint no-warning-comments: [1, { "terms": ["todo"], "location": "anywhere" }]*/

const dateformat = require('dateformat');
const submitData = (ctx, formdata) => {

    const body = {'type': 'Caveat'};

    const applicant = {};
    body.applicant = applicant;
    applicant.firstName = formdata.applicant.firstName;
    applicant.lastName = formdata.applicant.lastName;
    applicant.email = formdata.applicant.email;

    //TODO This needs to be refactored to produce a full address
    const applicantAddress = {};
    body.applicant.address = applicantAddress;
    applicantAddress.addressLine1 = formdata.applicant.address;

    const deceased = {};
    body.deceased = deceased;
    deceased.firstName = formdata.deceased.firstName;
    deceased.lastName = formdata.deceased.lastName;

    //TODO This needs to be refactored to produce a full address
    const deceasedAddress = {};
    body.deceased.address = deceasedAddress;
    deceasedAddress.addressLine1 = formdata.deceased.address;

    body.deceased.dod_date = dateformat(formdata.deceased.dod_date, 'yyyy-mm-dd');

    if (formdata.deceased.dobknown === 'Yes') {
        body.deceased.dob_date = dateformat(formdata.deceased.dob_date, 'yyyy-mm-dd');
    }

    if (formdata.deceased.alias === 'Yes') {
        body.deceased.otherNames = formdata.deceased.otherNames;
    }

    if (formdata.ccdCase) {
        const ccdCase = {};
        body.ccdCase = formdata.ccdCase;
        ccdCase.id = formdata.ccdCase.id;
        ccdCase.state = formdata.ccdCase.state;
    }

    const registry = {};
    if (formdata.registry) {
        body.registry = registry;
        body.registry.name = formdata.registry.name;
    }

    if (formdata.payments) {
        body.payments = formdata.payments;
    }

    return body;
};

module.exports = submitData;
