'use strict';

const expect = require('chai').expect;
const stringUtils = require('app/components/string-utils');

const CAPITALISATION_TEST_POSTCODE_1 = 'UB8 1PJ';
const CAPITALISATION_TEST_SOURCE_FORMAT_1 = '17, GLADE COURT, 65, HAREFIELD ROAD, UXBRIDGE, UB8 1PJ';
const CAPITALISATION_TEST_UPDATED_FORMAT_1 = '17 Glade Court,65 Harefield Road,Uxbridge,UB8 1PJ';

const ALPHANUMERIC_NUMBER_TEST_POSTCODE_1 = 'SW1H 9AJ';
const ALPHANUMERIC_NUMBER_TEST_SOURCE_FORMAT_1 = '1A, CONFERENCE ROOM, MINISTRY OF JUSTICE, 103 PETTY FRANCE, LONDON, SW1H 9AJ';
const ALPHANUMERIC_NUMBER_TEST_UPDATED_FORMAT_1 = '1A Conference Room,Ministry Of Justice,103 Petty France,London,SW1H 9AJ';

const DASHES_AND_DOTS_NUMBER_TEST_POSTCODE_1 = 'SW1H 9AJ';
const DASHES_AND_DOTS_NUMBER_TEST_SOURCE_FORMAT_1 = '1-9, CONFERENCE ROOM, 10.3, PETTY FRANCE, LONDON, SW1H 9AJ';
const DASHES_AND_DOTS_NUMBER_TEST_UPDATED_FORMAT_1 = '1-9 Conference Room,10.3 Petty France,London,SW1H 9AJ';

const APOSTROPHE_NAME_TEST_POSTCODE_1 = 'SW1A 2BJ';
const APOSTROPHE_NAME_TEST_SOURCE_FORMAT_1 = 'IVY LODGE, ST. JAMES\'S PARK, LONDON, SW1A 2BJ';
const APOSTROPHE_NAME_TEST_UPDATED_FORMAT_1 = 'Ivy Lodge,St. James\'s Park,London,SW1A 2BJ';

describe('updateLookupFormattedAddress()', () => {

    it('should produce the correct use of alphanumeric characters', (done) => {
        const output = stringUtils
            .updateLookupFormattedAddress(ALPHANUMERIC_NUMBER_TEST_SOURCE_FORMAT_1, ALPHANUMERIC_NUMBER_TEST_POSTCODE_1);
        expect(output).to.equal(ALPHANUMERIC_NUMBER_TEST_UPDATED_FORMAT_1);
        done();
    });

    it('should produce the correct capitilisation of words', (done) => {
        const output = stringUtils
            .updateLookupFormattedAddress(CAPITALISATION_TEST_SOURCE_FORMAT_1, CAPITALISATION_TEST_POSTCODE_1);
        expect(output).to.equal(CAPITALISATION_TEST_UPDATED_FORMAT_1);
        done();
    });

    it('should produce the correct use of dashes and dots', (done) => {
        const output = stringUtils
            .updateLookupFormattedAddress(DASHES_AND_DOTS_NUMBER_TEST_SOURCE_FORMAT_1, DASHES_AND_DOTS_NUMBER_TEST_POSTCODE_1);
        expect(output).to.equal(DASHES_AND_DOTS_NUMBER_TEST_UPDATED_FORMAT_1);
        done();
    });

    it('should produce the correct capitilisation using an apostrophe', (done) => {
        const output = stringUtils
            .updateLookupFormattedAddress(APOSTROPHE_NAME_TEST_SOURCE_FORMAT_1, APOSTROPHE_NAME_TEST_POSTCODE_1);
        expect(output).to.equal(APOSTROPHE_NAME_TEST_UPDATED_FORMAT_1);
        done();
    });

});
