'use strict';
const commonContent = require('app/resources/en/translation/common');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

Feature('Standard Execution flow');

Scenario('Standard Execution Journey', function* (I) {

    I.startApplication();

    // Applicant details
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.enterApplicantEmail('Applicant@email.com');
    I.enterApplicantAddressManually();

    // Deceased details
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.enterDeceasedDateOfDeath('01', '01', '2019');
    I.enterDeceasedDateOfBirthKnown('optionYes');
    I.enterDeceasedDateOfBirth('01', '01', '1977');
    I.enterDeceasedHasAlias('optionYes');
    I.enterDeceasedOtherNames(2);
    I.enterDeceasedAddressManually();

    // Summary page
    I.seeSummaryPage();

    // Payment pages
    I.seePaymentBreakdownPage();
    if (TestConfigurator.getUseGovPay() === 'true') {
        I.seeGovUkPaymentPage();
        I.seeGovUkConfirmPage();
    }
    // Thank You
    // I.seeThankYouPage();
}).retry(TestConfigurator.getRetryScenarios());

Scenario('Stop and Continuation of Main applicant journey:', function* (I) {
    I.startApplication();
    // Applicant details
    I.enterApplicantName('Applicant First Name', 'Applicant Last Name');
    I.enterApplicantEmail('Applicant@email.com');
    I.enterApplicantAddressManually();
    I.startApplication();
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
    //Deceased details
    I.enterDeceasedName('Deceased First Name', 'Deceased Last Name');
    I.enterDeceasedDateOfDeath('01', '01', '2019');
    I.enterDeceasedDateOfBirthKnown('optionYes');
    I.enterDeceasedDateOfBirth('01', '01', '1977');
    I.enterDeceasedHasAlias('optionYes');
    I.enterDeceasedOtherNames(2);
    I.enterDeceasedAddressManually();

    // Summary page
    I.seeSummaryPage();

    // Payment pages
    I.seePaymentBreakdownPage();
    if (TestConfigurator.getUseGovPay() === 'true') {
        I.seeGovUkPaymentPage();
        I.seeGovUkConfirmPage();
    }
    // Thank You
    // I.seeThankYouPage();
}).retry(TestConfigurator.getRetryScenarios());
