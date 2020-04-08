'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const expect = require('chai').expect;

describe('AddressStep', () => {
    let steps;
    let section;
    let templatePath;
    let i18next;
    let schema;
    let ctxToTest;
    let error;

    beforeEach(() => {
        steps = {};
        section = 'deceased';
        templatePath = 'addressLookup';
        i18next = {};
        schema = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            properties: {}
        };
        ctxToTest = {};
        error = {
            field: 'address',
            message: 'Please enter an address'
        };
    });

    describe('isComplete()', () => {
        it('should return true if address exists on context', (done) => {
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            const ctx = {address: {}};
            const [stepComplete, progressFlag] = addressStep.isComplete(ctx);
            expect(stepComplete).to.equal(true);
            expect(progressFlag).to.equal('inProgress');
            done();
        });

        it('should return false if address does not exists on context', (done) => {
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            const ctx = {};
            const [stepComplete, progressFlag] = addressStep.isComplete(ctx);
            expect(stepComplete).to.equal(false);
            expect(progressFlag).to.equal('inProgress');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should break address type into separate fields for display', (done) => {
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            ctxToTest = {address: {
                addressLine1: 'line1',
                addressLine2: 'line2',
                addressLine3: 'line3',
                postTown: 'town',
                postCode: 'postCode',
                country: 'country'
            }};
            const ctx = addressStep.handleGet(ctxToTest, null);
            expect(ctx).to.deep.equal([{
                address: {
                    addressLine1: 'line1',
                    addressLine2: 'line2',
                    addressLine3: 'line3',
                    postTown: 'town',
                    postCode: 'postCode',
                    country: 'country'
                },
                addressLine1: 'line1',
                addressLine2: 'line2',
                addressLine3: 'line3',
                county: '',
                postTown: 'town',
                newPostCode: 'postCode',
                country: 'country'
            }]);
            done();
        });

        it('should return ctx when there are no errors', (done) => {
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            const ctx = addressStep.handleGet(ctxToTest, null);
            expect(ctx).to.deep.equal([ctxToTest]);
            done();
        });

        it('should return ctx and errors when there are errors', (done) => {
            const formdata = {
                deceased: {errors: error}
            };
            ctxToTest.errors = error;
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            const ctx = addressStep.handleGet(ctxToTest, formdata);
            expect(ctx).to.deep.equal([ctxToTest, error]);
            expect(formdata).to.deep.equal({
                deceased: {}
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it('should return formatted address when an address exists', (done) => {
            ctxToTest = {
                addressLine1: 'line1',
                addressLine2: 'line2',
                addressLine3: 'line3',
                postTown: 'town',
                county: 'county',
                newPostCode: 'postcode',
                country: 'country'
            };
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            const ctx = addressStep.handlePost(ctxToTest, null);
            expect(ctx[0].address).to.deep.equal({
                addressLine1: 'line1',
                addressLine2: 'line2',
                addressLine3: 'line3',
                formattedAddress: 'line1 line2 line3 town postcode county country ',
                postTown: 'town',
                postCode: 'postcode',
                county: 'county',
                country: 'country'
            });
            done();
        });
    });
});
