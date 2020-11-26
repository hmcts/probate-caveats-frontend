'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/address/index');

async function enterApplicantAddressManually(language = 'en') {

    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const findAddress = language === 'en' ? 'Find address' : 'Dod o hyd i gyfeiriad';
    const I = this;

    I.waitInUrl(pageUnderTest.getUrl());
    I.seeInCurrentUrl(pageUnderTest.getUrl());
    I.fillField('postcode', 'SW9 9PD');
    await I.navByClick(findAddress);

    I.waitForVisible('#postcodeAddress');
    I.selectOption('#postcodeAddress', 0);
    I.wait(4);
    I.waitForElement('#addressLine1');
    I.wait(2);
    await I.navByClick(commonContent.saveAndContinue);

}

module.exports = {enterApplicantAddressManually};
