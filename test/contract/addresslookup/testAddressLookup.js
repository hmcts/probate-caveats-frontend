'use strict';

const expect = require('chai').expect;
const logger = require('app/components/logger')('Init');
const testConfig = require('config');
const POSTCODE_SERVICE_TOKEN = testConfig.postcodeLookup.token;
const OSPlacesClient = require('@hmcts/os-places-client').OSPlacesClient;
const osPlacesClient = new OSPlacesClient(POSTCODE_SERVICE_TOKEN);
const osPlacesClientUnauthorised = new OSPlacesClient('INVALID-TOKEN');

describe('Address Lookup API Tests', () => {
    describe('Basic ping', () => {
        it('Returns HTTP 403 status', (done) => {
            osPlacesClientUnauthorised.lookupByPostcode(testConfig.postcodeLookup.singleAddressPostcode)
                .then(res => {
                    done(new Error(`Test failed ${JSON.stringify(res)}`));
                })
                .catch(err => {
                    expect(err.name).to.equal('Error');
                    expect(err.message).to.equal('Authentication failed');
                    done();
                });
        });
    });

    describe('Single address returned for postcode', () => {
        it('Returns single address', (done) => {
            osPlacesClient.lookupByPostcode(testConfig.postcodeLookup.singleAddressPostcode)
                .then(res => {
                    expect(res.addresses.length).to.equal(1);
                    expect(res.valid).to.equal(true);
                    expect(res.httpStatus).to.equal(200);
                    expect(res.addresses[0].organisationName).to.equal(testConfig.postcodeLookup.singleOrganisationName);
                    expect(res.addresses[0].formattedAddress).to.equal(testConfig.postcodeLookup.singleFormattedAddress);
                    done();
                })
                .catch(err => {
                    logger.error(`Postcode lookup failed to run: ${err}`);
                    done(new Error('Test failed'));
                });
        });
    });

    describe('Multiple addresses returned for postcode', () => {
        it('Returns multiple addresses', (done) => {
            osPlacesClient.lookupByPostcode(testConfig.postcodeLookup.multipleAddressPostcode)
                .then(res => {
                    expect(res.addresses.length).to.equal(12);
                    expect(res.valid).to.equal(true);
                    expect(res.httpStatus).to.equal(200);
                    done();
                })
                .catch(err => {
                    logger.error(`Postcode lookup failed to run: ${err}`);
                    done(new Error('Test failed'));
                });
        });
    });

    describe('Partial postcode test (returns greater number of results)', () => {
        it('No address returned for partial postcode', (done) => {
            osPlacesClient.lookupByPostcode(testConfig.postcodeLookup.partialAddressPostcode)
                .then(res => {
                    expect(res.addresses.length).to.equal(100);
                    expect(res.valid).to.equal(true);
                    expect(res.httpStatus).to.equal(200);
                    done();
                })
                .catch(err => {
                    logger.error(`Postcode lookup failed to run: ${err}`);
                    done(new Error('Test failed'));
                });
        });
    });

    describe('Invalid postcode test', () => {
        it('No address returned for invalid postcode', (done) => {
            osPlacesClient.lookupByPostcode(testConfig.postcodeLookup.invalidAddressPostcode)
                .then(res => {
                    expect(res.addresses.length).to.equal(0);
                    expect(res.valid).to.equal(false);
                    expect(res.httpStatus).to.equal(200);
                    done();
                })
                .catch(err => {
                    logger.error(`Postcode lookup failed to run: ${err}`);
                    done(new Error('Test failed'));
                });
        });
    });

    describe('No postcode entered test', () => {
        it('No address returned for no postcode entered', (done) => {
            osPlacesClient.lookupByPostcode(testConfig.postcodeLookup.emptyAddressPostcode)
                .then(res => {
                    done(new Error(`Test failed ${JSON.stringify(res)}`));
                })
                .catch(err => {
                    expect(err.name).to.equal('Error');
                    expect(err.message).to.equal('Missing required postcode');
                    done();
                });
        });
    });
});
