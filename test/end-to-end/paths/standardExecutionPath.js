'use strict';

const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

Feature('Standard Execution flow');

// eslint complains that the Before/After are not used but they are by codeceptjs
// so we have to tell eslint to not validate these
// eslint-disable-next-line no-undef
Before(() => {
    TestConfigurator.getBefore();
});

// eslint-disable-next-line no-undef
After(() => {
    TestConfigurator.getAfter();
});

Scenario('Standard Execution Journey', function* (I) {

    I.startApplication();

    // Applicant details
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    // temp stop page - to represent end of journey
    I.seeEndOfJourney();
}).retry(TestConfigurator.getRetryScenarios());
