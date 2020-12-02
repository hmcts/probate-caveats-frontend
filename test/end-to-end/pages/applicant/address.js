'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/address/index');

async function enterApplicantAddressManually(language = 'en', testAddressIndex) {

    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const findAddress = language === 'en' ? 'Find UK address' : 'Dod o hyd i gyfeiriad';
    const I = this;

    if (!testAddressIndex) {
        testAddressIndex = '0';
    }

    I.waitInUrl(pageUnderTest.getUrl());
    I.seeInCurrentUrl(pageUnderTest.getUrl());
    I.fillField('postcode', 'SW9 9PD');
    await I.navByClick(findAddress);
    I.wait(2);
    I.waitForVisible('#postcodeAddress');
    I.selectOption('#postcodeAddress', testAddressIndex);
    I.wait(2);
    I.waitForElement('#addressLine1');
    I.wait(2);
    await I.navByClick(commonContent.saveAndContinue);

}

module.exports = {enterApplicantAddressManually};
