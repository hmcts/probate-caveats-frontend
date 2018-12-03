'use strict';

const stepList = {
    StartPage: 'ApplicantName',
    ApplicantName: 'ApplicantEmail',
    ApplicantEmail: 'EndJourneyPage',
    DeceasedDod: 'StartPage'
};

module.exports.stepList = stepList;
