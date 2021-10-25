'use strict';

const stepList = {
    StartApply: 'ApplicantName',
    ApplicantName: 'ApplicantEmail',
    ApplicantEmail: 'ApplicantAddress',
    ApplicantAddress: 'DeceasedName',
    DeceasedName: 'DeceasedDod',
    DeceasedDod: 'DeceasedAlias',
    DeceasedAlias: {
        assetsInOtherNames: 'DeceasedOtherNames',
        otherwise: 'DeceasedAddress'
    },
    AddAlias: 'DeceasedOtherNames',
    RemoveAlias: 'DeceasedOtherNames',
    DeceasedOtherNames: 'DeceasedAddress',
    DeceasedAddress: 'BilingualGOP',
    BilingualGOP: 'Equality',
    Equality: 'Summary',
    Summary: 'PaymentBreakdown',
    PaymentBreakdown: 'PaymentStatus',
    PaymentStatus: 'ThankYou',

    AddressLookup: 'AddressLookup'
};

module.exports.stepList = stepList;
