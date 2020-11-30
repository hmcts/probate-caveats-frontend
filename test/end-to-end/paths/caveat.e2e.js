const contentEn = require('app/resources/en/translation/common');
const contentCy = require('app/resources/cy/translation/common');
const testConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const languages = ['en'];

Feature('Standard Caveat E2E...');

languages.forEach(language => {

    Before(async (I) => {
        await I.amOnLoadedPage('/', language);
        await I.startApplication(language);
        await I.enterApplicantName(language, 'Applicant First Name', 'Applicant Last Name');
        await I.enterApplicantEmail(language, 'Applicant@email.com');
        await I.enterApplicantAddressManually(language);
    });

    Scenario(`${language.toUpperCase()} - Caveat E2E`, async function (I) {

        await I.enterDeceasedName(language, 'Deceased First Name', 'Deceased Last Name');
        await I.enterDeceasedDateOfDeath(language, '01', '01', '2019');
        await I.enterDeceasedDateOfBirthKnown(language);
        await I.enterDeceasedDateOfBirth(language, '01', '01', '1977');
        await I.enterDeceasedHasAlias(language);
        await I.enterDeceasedOtherNames(language, 2);
        await I.enterDeceasedAddressManually(language);

        await I.selectBilingualGopNo(language);
        if (testConfigurator.equalityAndDiversityEnabled) {
            await I.completeEquality(language);
        }

        await I.seeSummaryPage(language);
        await I.seePaymentBreakdownPage(language);
        if (testConfigurator.getUseGovPay() === 'true') {
            await I.seeGovUkPaymentPage();
            await I.seeGovUkConfirmPage();
        }

        const isCaseIDGenerated = await I.checkElementExist('//h1[contains(text(), \'Application complete\')]');
        if (isCaseIDGenerated) {
            I.seeThankYouPage();
        }

    }).tag('@e2e')
        .retry(2);

    xScenario(`${language.toUpperCase()} - Caveat Stop and Continuation of Main applicant journey:`, async function (I) {
        const commonContent = language === 'en' ? contentEn : contentCy;
        await I.startApplication();

        await I.navByClick(commonContent.saveAndContinue);
        await I.navByClick(commonContent.saveAndContinue);
        await I.navByClick(commonContent.saveAndContinue);

        await I.enterDeceasedName(language, 'Deceased First Name', 'Deceased Last Name');
        await I.enterDeceasedDateOfDeath(language, '01', '01', '2019');
        await I.enterDeceasedDateOfBirthKnown(language);
        await I.enterDeceasedDateOfBirth(language, '01', '01', '1977');
        await I.enterDeceasedHasAlias(language);
        await I.enterDeceasedOtherNames(language, 2);
        await I.enterDeceasedAddressManually(language);

        await I.selectBilingualGopNo(language);
        await I.completeEquality(language);

        await I.seeSummaryPage(language);
        await I.seePaymentBreakdownPage(language);

        if (testConfigurator.getUseGovPay() === 'true') {
            await I.seeGovUkPaymentPage();
            await I.seeGovUkConfirmPage();
        }

        const isCaseIDGenerated = await I.checkElementExist('//h1[contains(text(), \'Application complete\')]');
        if (isCaseIDGenerated) {
            I.seeThankYouPage();
        }

    }).tag('@e2e')
        .retry(2);

});
