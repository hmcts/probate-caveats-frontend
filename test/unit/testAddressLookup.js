'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const sinon = require('sinon');
const when = require('when');
const services = require('app/components/services');
const co = require('co');

describe('AddressLookup', function () {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const AddressLookup = steps.AddressLookup;

    describe('handlePost', function () {
        let findAddressStub;

        beforeEach(function () {
            findAddressStub = sinon.stub(services, 'findAddress');
        });

        afterEach(function () {
            findAddressStub.restore();
        });

        it('Adds addresses to formdata', function (done) {
            const expectedResponse = [{
                formattedAddress: 'MINISTRY OF JUSTICE,SEVENTH FLOOR,103 PETTY FRANCE,LONDON,SW1H 9AJ',
                postcode: 'SW1H 9AJ'
            },
            {
                formattedAddress: 'MINISTRY OF JUSTICE,SEVENTH FLOOR,102 PETTY FRANCE,LONDON,SW1H 9AJ',
                postcode: 'SW1H 9AJ'
            }];
            findAddressStub.returns(when(expectedResponse));

            let ctx = {
                referrer: 'ApplicantAddress',
                postcode: 'SW1H 9AJ'
            };
            let errors = {};
            const formdata = {applicant: {'someThingToLookFor': 'someThingToLookFor'}};

            co(function* () {
                [ctx, errors] = yield AddressLookup.handlePost(ctx, errors, formdata);
                assert.deepEqual(formdata.applicant.addresses, expectedResponse);
                assert.equal(formdata.applicant.addressFound, 'true');
                done();
            });
        });

        it('Creates an error if address not found', function (done) {
            const expectedResponse = {};
            findAddressStub.returns(when(expectedResponse));

            const session = {
                language: 'en'
            };
            let ctx = {
                referrer: 'ApplicantAddress',
                postcode: 'wibble'
            };
            let errors = {};
            const formdata = {applicant: {'someThingToLookFor': 'someThingToLookFor'}};

            co(function* () {
                [ctx, errors] = yield AddressLookup.handlePost(ctx, errors, formdata, session);
                assert.equal(formdata.applicant.addressFound, 'false');
                assert.exists(formdata.applicant.errors[0], 'key not found');
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });

        it('Returns the errors in referrerData if errors present', function (done) {
            const expectedResponse = {};
            findAddressStub.returns(when(expectedResponse));

            const session = {
                language: 'en'
            };
            let ctx = {
                referrer: 'ApplicantAddress',
                postcode: 'wibble'
            };
            let errors = {
                error: 'sample error'
            };
            const formdata = {applicant: {someThingToLookFor: 'someThingToLookFor'}};

            co(function* () {
                [ctx, errors] = yield AddressLookup.handlePost(ctx, errors, formdata, session);
                expect(formdata).to.deep.equal({applicant: {someThingToLookFor: 'someThingToLookFor', postcode: 'wibble', errors: {error: 'sample error'}}});
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('getReferrerData', function () {
        it('It gets the referer data section from the formdata', function () {
            const ctx = {'referrer': 'ApplicantAddress'};
            const formdata = {applicant: {'someThingToLookFor': 'someThingToLookFor'}};
            const ret = AddressLookup.getReferrerData(ctx, formdata);
            assert.deepEqual(ret, {'someThingToLookFor': 'someThingToLookFor'});
        });

        it('It creates the referer data section from the formdata if one does not exist', function () {
            const ctx = {'referrer': 'ApplicantAddress'};
            const formdata = {};
            const ret = AddressLookup.getReferrerData(ctx, formdata);
            assert.deepEqual(ret, {});
        });
    });

    describe('pruneReferrerData', function () {
        it('It deletes the referer data', function () {
            const referrerData = {
                addresses: 'addresses',
                addressFound: 'addressFound',
                postcodeAddress: 'postcodeAddress',
                freeTextAddress: 'freeTextAddress'
            };
            AddressLookup.pruneReferrerData(referrerData);
            assert.deepEqual(referrerData, {});
        });
    });
});
