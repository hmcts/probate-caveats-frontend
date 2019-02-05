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
        otherwise: 'DeceasedAlias'
    },
    DeceasedDob: 'DeceasedAlias',
    DeceasedAlias: {
        assetsInOtherNames: 'DeceasedOtherNames',
        otherwise: 'DeceasedAddressKnown'
    },
    DeceasedAddressKnown: {
        addressknown: 'DeceasedAddress',
        otherwise: 'Summary'
    },
    DeceasedOtherNames: 'DeceasedAddressKnown',
    AddAlias: 'DeceasedOtherNames',
    RemoveAlias: 'DeceasedOtherNames',
    DeceasedAddress: 'Summary',
    Summary: 'ThankYou',
    ThankYou: 'EndJourneyPage',

    AddressLookup: 'AddressLookup'
};

module.exports.stepList = stepList;
