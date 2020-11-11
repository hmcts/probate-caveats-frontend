'use strict';

const dateformat = require('dateformat');
const submitData = (ctx, formdata) => {

    const body = {'type': 'Caveat'};
    body.applicationId = formdata.applicationId;

    body.applicant = {};
    body.applicant.firstName = formdata.applicant.firstName;
    body.applicant.lastName = formdata.applicant.lastName;
    body.applicant.email = formdata.applicant.email;
    body.applicant.address = formdata.applicant.address;

    body.deceased = {};
    body.deceased.firstName = formdata.deceased.firstName;
    body.deceased.lastName = formdata.deceased.lastName;

    body.deceased.address = formdata.deceased.address;
    body.deceased.alias = formdata.deceased.alias;

    body.deceased.dod_date = dateformat(formdata.deceased['dod-date'], 'yyyy-mm-dd');

    if (formdata.deceased.dobknown === 'optionYes') {
        body.deceased.dob_date = dateformat(formdata.deceased['dob-date'], 'yyyy-mm-dd');
    }

    if (formdata.deceased.alias === 'optionYes') {
        body.deceased.otherNames = formdata.deceased.otherNames;
    }

    if (formdata.ccdCase) {
        body.ccdCase = {};
        body.ccdCase.id = formdata.ccdCase.id;
        body.ccdCase.state = formdata.ccdCase.state;
    }

    if (formdata.registry) {
        body.registry = {};
        body.registry.name = formdata.registry.name;
    }

    if (formdata.payment) {
        body.payments = [];
        body.payments.push(formdata.payment);
    }

    body.language = {};
    body.language.bilingual = formdata.language.bilingual;

    if (formdata.equality) {
        body.equality = {};
        body.equality.pcqId = formdata.equality.pcqId;
    }

    return body;
};

module.exports = submitData;
