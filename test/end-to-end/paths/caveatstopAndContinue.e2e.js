const {getTestLanguages} = require('../helpers/GeneralHelpers');
const testConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();

Feature('Caveat Stop and Continuation of Main applicant E2E...').retry(2);

getTestLanguages().forEach(language => {

    Scenario(`${language.toUpperCase()} - Caveat Stop and Continuation of Main applicant journey:`, async function ({I}) {
        await startApplicationToApplicantAddress(I, language);

        await I.enterDeceasedName(language, 'Deceased First Name', 'Deceased Last Name');
        await I.enterDeceasedDateOfDeath(language, '01', '01', '2019');
        await I.enterDeceasedHasAlias(language);
        await I.enterDeceasedOtherNames(language, 2);
        await I.enterDeceasedAddressManually(language);

        await I.selectBilingualGopNo(language);
        if (testConfigurator.equalityAndDiversityEnabled) {
            await I.completeEquality(language);
            await I.selectBilingualGopNo(language);
        }

        await I.seeSummaryPage(language);
        await I.seePaymentBreakdownPage(language);

        if (testConfigurator.getUseGovPay() === 'true') {
            await I.seeGovUkPaymentPage(language);
            await I.seeGovUkConfirmPage();
        }

        const caseIDGenerated = await I.checkElementExist('//*[@id="main-content"]/div/div/div[1]/h1');
        if (caseIDGenerated) {
            await I.seeThankYouPage(language);
        }

    }).tag('@nightly')
        .retry(2);

});

async function startApplicationToApplicantAddress(I, language) {
    await I.amOnLoadedPage('/', language);
    await I.startApplication(language);
    await I.enterApplicantName(language, 'Applicant First Name', 'Applicant Last Name');
    await I.enterApplicantEmail(language, 'Applicant@email.com');
    await I.enterApplicantAddressManually(language);
}
