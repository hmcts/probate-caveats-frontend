'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = function () {

    return actor({

        // //Start application
        startApplication: steps.startPage.startPage,

        enterApplicantName: steps.applicant.name,

        enterApplicantEmail: steps.applicant.email,


        // temp stop page to represent end of journey
        seeEndOfJourney: steps.endJourney.endJourney
    });
};
