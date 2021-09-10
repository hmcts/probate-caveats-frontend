/* eslint-disable no-await-in-loop */
'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/othernames/index');
const otherNamesEn = require('app/resources/en/translation/deceased/othernames');
const otherNamesCy = require('app/resources/cy/translation/deceased/othernames');

async function enterDeceasedOtherNames (language ='en', noOfAliases) {
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const otherNames = language === 'en' ? otherNamesEn : otherNamesCy;
    const I = this;

    await I.waitInUrl(pageUnderTest.getUrl());
    let i = 1;

    while (i <= noOfAliases) {
        if (i === 1) {
            await I.fillField('#otherNames_name_'+ (i-1) + '_firstName', 'alias_firstnames_' + i);
            await I.fillField('#otherNames_name_'+ (i-1) + '_lastName', 'alias_lastnames_' + i);
        } else {
            await I.click(otherNames.addAnotherName);
            await I.wait(6);
            await I.fillField('#otherNames_name_'+ (i-1) + '_firstName', 'alias_firstnames_' + i);
            await I.fillField('#otherNames_name_'+ (i-1) + '_lastName', 'alias_lastnames_' + i);
        }

        i += 1;
    }
    await I.navByClick(commonContent.saveAndContinue);
}

module.exports = {enterDeceasedOtherNames};
