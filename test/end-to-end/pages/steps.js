'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = function () {

    return actor({

        // //Start application
        startApplication: steps.startPage.startPage,

        enterApplicantName: steps.applicant.name,

        enterApplicantEmail: steps.applicant.email,

        enterAddressManually: steps.applicant.address,

        enterDeceasedName: steps.deceased.name,

        enterDeceasedDateOfDeath: steps.deceased.dod,

        enterDeceasedDateOfBirthKnown: steps.deceased.dobknown,

        enterDeceasedDateOfBirth: steps.deceased.dob,
        // temp stop page to represent end of journey
        seeEndOfJourney: steps.endJourney.endJourney
    });
};
