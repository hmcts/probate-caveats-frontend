const initSteps = require('app/core/initSteps'),
    assert = require('chai').assert,
    sinon = require('sinon'),
    when = require('when'),
    services = require('app/components/services');
const co = require('co');

describe('AddressLookup', function () {

    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);

    describe('handlePost', function () {

        let findAddressStub;

        beforeEach(function () {
            findAddressStub = sinon.stub(services, 'findAddress');
        });

        afterEach(function () {
            findAddressStub.restore();
        });

        it('Adds addresses to formdata', function (done) {

            const expectedResponse = ['address 1', 'address 2'];
            findAddressStub.returns(when(expectedResponse));

            const AddressLookup = steps.AddressLookup;
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

            const AddressLookup = steps.AddressLookup;
            let ctx = {
                referrer: 'ApplicantAddress',
                postcode: 'wibble'
            };
            let errors = {};
            const formdata = {applicant: {'someThingToLookFor': 'someThingToLookFor'}};

            co(function* () {
                [ctx, errors] = yield AddressLookup.handlePost(ctx, errors, formdata);
                assert.equal(formdata.applicant.addressFound, 'false');
                assert.exists(formdata.applicant.errors[0], 'key not found');
                done();
            })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('getReferrerData', function () {
        it('It gets the referer data section from the formdata', function () {

            const AddressLookup = steps.AddressLookup;

            const ctx = {'referrer': 'ApplicantAddress'};
            const formdata = {applicant: {'someThingToLookFor': 'someThingToLookFor'}};
            const ret = AddressLookup.getReferrerData(ctx, formdata);
            assert.deepEqual(ret, {'someThingToLookFor': 'someThingToLookFor'});
        });

        it('It creates the referer data section from the formdata if one does not exist', function () {

            const AddressLookup = steps.AddressLookup;

            const ctx = {'referrer': 'ApplicantAddress'};
            const formdata = {};
            const ret = AddressLookup.getReferrerData(ctx, formdata);
            assert.deepEqual(ret, {});
        });
    });

    describe('pruneReferrerData', function () {
        it('It deletes the referer data', function () {
            const AddressLookup = steps.AddressLookup;
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
