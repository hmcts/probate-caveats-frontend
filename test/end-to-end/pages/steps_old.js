'use strict';

const requireDirectory = require('require-directory');
const steps_old = requireDirectory(module);

module.exports = function () {

    return actor({
        // Start application
        startApplication: steps_old.startapply.startapply,

        enterApplicantName: steps_old.applicant.name,
        enterApplicantEmail: steps_old.applicant.email,
        enterApplicantAddressManually: steps_old.applicant.address,
        enterDeceasedName: steps_old.deceased.name,
        enterDeceasedDateOfDeath: steps_old.deceased.dod,
        enterDeceasedDateOfBirthKnown: steps_old.deceased.dobknown,
        enterDeceasedDateOfBirth: steps_old.deceased.dob,
        enterDeceasedHasAlias: steps_old.deceased.alias,
        enterDeceasedOtherNames: steps_old.deceased.othernames,
        enterDeceasedAddressManually: steps_old.deceased.address,
        seeSummaryPage: steps_old.summary.summary,

        // Payment
        seePaymentBreakdownPage: steps_old.payment.paymentbreakdown,
        seeGovUkPaymentPage: steps_old.payment.govukpayment,
        seeGovUkConfirmPage: steps_old.payment.govukconfirmpayment,
        seePaymentStatusPage: steps_old.payment.paymentstatus,

        // enterPaymentBreakdown: steps_old.payment.breakdown,

        // Temp stop page to represent end of journey
        seeThankYouPage: steps_old.thankyou.thankyou
    });
};
