'use strict';

const stepList = {
    StartPage: 'ApplicantName',
    ApplicantName: 'ApplicantEmail',
    ApplicantEmail: 'ApplicantAddress',
    ApplicantAddress: 'DeceasedDod',
    AddressLookup: 'AddressLookup',
    DeceasedDod: 'EndJourneyPage'
};

module.exports.stepList = stepList;
