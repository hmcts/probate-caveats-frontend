'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/address/index');

async function enterApplicantAddressManually(language = 'en', testAddressIndex = '0') {

    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const findAddress = language === 'en' ? 'Find UK address' : 'Dod o hyd i gyfeiriad';
    const I = this;

    await I.waitInUrl(pageUnderTest.getUrl());
    await I.seeInCurrentUrl(pageUnderTest.getUrl());
    await I.waitForVisible('#postcode');
    await I.fillField('postcode', 'SW9 9PD');
    await I.navByClick(findAddress);
    await I.waitForVisible('#postcodeAddress');
    await I.selectOption('#postcodeAddress', testAddressIndex);
    await I.waitForElement('#addressLine1');
    await I.waitForText(commonContent.saveAndContinue);
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterApplicantAddressManually};
