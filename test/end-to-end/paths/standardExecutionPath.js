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
    I.enterApplicantEmail('Applicant@email.com');
    I.enterApplicantAddressManually();

    // Deceased details
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.enterDeceasedDateOfDeath('01', '01', '2019');
    I.enterDeceasedDateOfBirthKnown('Yes');
    I.enterDeceasedDateOfBirth('01', '01', '1977');
    I.enterDeceasedHasAlias('Yes');
    I.enterDeceasedOtherNames(2);
    I.enterDeceasedAddressManually();

    // Summary page
    I.seeSummaryPage();

    // Payment pages
    I.enterPaymentBreakdown();

    // Thank you page -commented out until payments are working
    //I.seeThankYouPage();

}).retry(TestConfigurator.getRetryScenarios());
