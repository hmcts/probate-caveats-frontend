'use strict';

const stepList = {
    StartPage: 'ApplicantName',
    ApplicantName: 'ApplicantEmail',
    ApplicantEmail: 'ApplicantAddress',
    ApplicantAddress: 'EndJourneyPage',
    AddressLookup: 'AddressLookup'
};

module.exports.stepList = stepList;
