const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/deceased/otherNames/index');

module.exports = function (noOfAliases) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    let i = 1;

    while (i <= noOfAliases) {
        if (i === 1) {
            I.fillField('#otherNames_name_'+ (i-1) + '_firstName', 'alias_firstnames_' + i);
            I.fillField('#otherNames_name_'+ (i-1) + '_lastName', 'alias_lastnames_' + i);
        } else {
            I.click('Add another name');
            I.fillField('#otherNames_name_'+ (i-1) + '_firstName', 'alias_firstnames_' + i);
            I.fillField('#otherNames_name_'+ (i-1) + '_lastName', 'alias_lastnames_' + i);
        }

        i += 1;
    }

    I.click(commonContent.continue);
};
