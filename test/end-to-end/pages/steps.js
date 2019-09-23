'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = function () {

    return actor({
        // Start application
        startApplication: steps.startapply.startapply,

        enterApplicantName: steps.applicant.name,
        enterApplicantEmail: steps.applicant.email,
        enterApplicantAddressManually: steps.applicant.address,
        enterDeceasedName: steps.deceased.name,
        enterDeceasedDateOfDeath: steps.deceased.dod,
        enterDeceasedDateOfBirthKnown: steps.deceased.dobknown,
        enterDeceasedDateOfBirth: steps.deceased.dob,
        enterDeceasedHasAlias: steps.deceased.alias,
        enterDeceasedOtherNames: steps.deceased.othernames,
        enterDeceasedAddressManually: steps.deceased.address,
        seeSummaryPage: steps.summary.summary,

        // Payment
        seePaymentBreakdownPage: steps.payment.paymentbreakdown,
        seeGovUkPaymentPage: steps.payment.govukpayment,
        seeGovUkConfirmPage: steps.payment.govukconfirmpayment,
        seePaymentStatusPage: steps.payment.paymentstatus,

        // enterPaymentBreakdown: steps.payment.breakdown,

        // Temp stop page to represent end of journey
        seeThankYouPage: steps.thankyou.thankyou
    });
};
