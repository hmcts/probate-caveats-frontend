const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const languages = ['en', 'cy'];

Feature('Standard Caveat E2E...');

languages.forEach(language => {

    Before(async (I) => {
        await I.amOnLoadedPage('/');
        await I.startApplication(language);
        await I.enterApplicantName(language, 'Applicant First Name', 'Applicant Last Name');
        await I.enterApplicantEmail(language, 'Applicant@email.com');
        await I.enterApplicantAddressManually(language);
    });

    Scenario(`${language.toUpperCase()} - Caveat E2E`, async function (I) {
        const commonContent = language === 'en' ? contentEn : contentCy;

        await I.enterDeceasedName(language, 'Deceased First Name', 'Deceased Last Name');
        await I.enterDeceasedDateOfDeath(language, '01', '01', '2019');
        await I.enterDeceasedDateOfBirthKnown(language, commonContent.yes);
        await I.enterDeceasedDateOfBirth(language, '01', '01', '1977');
        await I.enterDeceasedHasAlias(language, commonContent.yes);
        await I.enterDeceasedOtherNames(language, 2);
        await I.enterDeceasedAddressManually(language);

        await I.selectBilingualGopNo(language);
        await I.completeEquality(language);

        await I.seeSummaryPage(language);
        await I.seePaymentBreakdownPage(language);

        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.seeGovUkPaymentPage();
            await I.seeGovUkConfirmPage();
        }

        I.seeThankYouPage();

    }).tag('@e2e')
        .retry(2);

    Scenario(`${language.toUpperCase()} - Caveat Stop and Continuation of Main applicant journey:`, async function (I) {
        const commonContent = language === 'en' ? contentEn : contentCy;
        await I.startApplication();

        await I.navByClick(commonContent.saveAndContinue);
        await I.navByClick(commonContent.saveAndContinue);
        await I.navByClick(commonContent.saveAndContinue);

        await I.enterDeceasedName(language, 'Deceased First Name', 'Deceased Last Name');
        await I.enterDeceasedDateOfDeath(language, '01', '01', '2019');
        await I.enterDeceasedDateOfBirthKnown(language, commonContent.yes);
        await I.enterDeceasedDateOfBirth(language, '01', '01', '1977');
        await I.enterDeceasedHasAlias(language, commonContent.yes);
        await I.enterDeceasedOtherNames(language, 2);
        await I.enterDeceasedAddressManually(language);

        await I.selectBilingualGopNo(language);
        await I.completeEquality(language);

        await I.seeSummaryPage(language);
        await I.seePaymentBreakdownPage(language);

        if (TestConfigurator.getUseGovPay() === 'true') {
            await I.seeGovUkPaymentPage();
            await I.seeGovUkConfirmPage();
        }

        await I.seeThankYouPage();

    }).tag('@e2e123')
        .retry(2);

});
