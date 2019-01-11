'use strict';

const stepList = {
    StartPage: 'ApplicantName',
    ApplicantName: 'ApplicantEmail',
    ApplicantEmail: 'ApplicantAddress',
    ApplicantAddress: 'DeceasedName',
    DeceasedName: 'DeceasedDod',
    DeceasedDod: 'DeceasedDobKnown',
    DeceasedDobKnown: {
        dobknown: 'DeceasedDob',
        otherwise: 'EndJourneyPage'
    },
    DeceasedDob: 'EndJourneyPage',
    AddressLookup: 'AddressLookup'
};

module.exports.stepList = stepList;
