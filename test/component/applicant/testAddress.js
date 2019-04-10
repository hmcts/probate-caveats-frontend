'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedName = require('app/steps/ui/deceased/name/index');
const testAddressData = require('test/data/find-address');
const formatAddress = address => address.replace(/\n/g, ' ');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('applicant-address', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedName = DeceasedName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantAddress');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ApplicantAddress', true);

        it('test right content loaded on the page', (done) => {
            const excludeKeys = ['selectAddress'];
            const sessionData = {applicant: 'value'};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test error messages displayed for missing data', (done) => {
            const data = {addressFound: 'none'};

            testWrapper.testErrors(done, data, 'required', ['postcodeLookup']);
        });

        it('test validation when address search is successful, but no address is selected or entered', (done) => {
            const data = {addressFound: 'true'};

            testWrapper.testErrors(done, data, 'oneOf', ['crossField']);

        });

        it('test address validation when address search is successful, and two addresses are provided', (done) => {
            const data = {
                addressFound: 'true',
                freeTextAddress: 'free text address',
                postcodeAddress: 'postcode address'
            };

            testWrapper.testErrors(done, data, 'oneOf', ['crossField']);

        });

        it('test address validation when address search is unsuccessful', (done) => {
            const data = {
                addressFound: 'false'
            };

            testWrapper.testErrors(done, data, 'required', ['freeTextAddress']);

        });

        it(`test it redirects to deceased name page: ${expectedNextUrlForDeceasedName}`, (done) => {
            const data = {
                postcode: 'ea1 eaf',
                postcodeAddress: '102 Petty France'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedName);
        });

        it('should display the selected address option if an error is caused by completing both addresses', (done) => {
            const data = {
                postcode: 'SW1H 9AJ',
                postcodeAddress: 'Ministry of Justice Seventh Floor 102 Petty France London SW1H 9AJ',
                freeTextAddress: 'Some other random address',
                addresses: [{
                    building_number: '102',
                    organisation_name: 'MINISTRY OF JUSTICE',
                    post_town: 'LONDON',
                    postcode: 'SW1H 9AJ',
                    sub_building_name: 'SEVENTH FLOOR',
                    thoroughfare_name: 'PETTY FRANCE',
                    uprn: '10033604583',
                    formatted_address: 'Ministry of Justice\nSeventh Floor\n102 Petty France\nLondon\nSW1H 9AJ'
                }]
            };
            const contentToCheck = [
                `<option selected>${data.postcodeAddress}</option>`
            ];
            testWrapper.testContentAfterError(data, contentToCheck, done);
        });

        it('test the address dropdown box displays all addresses when the user returns to the page', (done) => {
            const sessionData = {
                postcode: testAddressData[1].postcode,
                postcodeAddress: formatAddress(testAddressData[1].formatted_address),
                addresses: testAddressData
            };
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .send(sessionData)
                .end(() => {
                    const contentToCheck = testAddressData.map(address => {
                        const formattedAddress = formatAddress(address.formatted_address);
                        return `<option ${formattedAddress === sessionData.postcodeAddress ? 'selected' : ''}>${formattedAddress}</option>`;
                    });
                    testWrapper.testDataPlayback(done, contentToCheck);
                });
        });
    });
});
