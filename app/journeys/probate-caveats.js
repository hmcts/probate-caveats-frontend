'use strict';

const stepList = {
    StartPage: 'ApplicantName',
    ApplicantName: 'ApplicantEmail',
    ApplicantEmail: 'ApplicantAddress',
    ApplicantAddress: 'DeceasedName',
    DeceasedName: 'DeceasedDod',
    DeceasedDod: 'DeceasedDoB',
    DeceasedDoB: 'EndJourneyPage',
    AddressLookup: 'AddressLookup'
};

module.exports.stepList = stepList;
