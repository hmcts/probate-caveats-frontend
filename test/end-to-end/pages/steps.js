'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = function () {

    return actor({
        // Start application
        startApplication: steps.startpage.startpage,

        enterApplicantName: steps.applicant.name,
        enterApplicantEmail: steps.applicant.email,
        enterApplicantAddressManually: steps.applicant.address,
        enterDeceasedName: steps.deceased.name,
        enterDeceasedDateOfDeath: steps.deceased.dod,
        enterDeceasedDateOfBirthKnown: steps.deceased.dobknown,
        enterDeceasedDateOfBirth: steps.deceased.dob,
        enterDeceasedHasAlias: steps.deceased.alias,
        enterDeceasedOtherNames: steps.deceased.otherNames,
        enterDeceasedAddressManually: steps.deceased.address,
        seeSummaryPage: steps.summary.summary,

        // Temp stop page to represent end of journey
        seeEndOfJourney: steps.endjourney.endjourney
    });
};
