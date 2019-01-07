'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const chai = require('chai');
const expect = chai.expect;

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
        section = 'executors';
        templatePath = 'addressLookup';
        i18next = {};
        schema = {
            '$schema': 'http://json-schema.org/draft-04/schema#',
            properties: {}
        };
        ctxToTest = {};
        error = {
            field: 'address',
            message: 'Please enter an address'
        };
    });

    describe('handleGet()', () => {
        it('should return ctx when there are no errors', (done) => {
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            const ctx = addressStep.handleGet(ctxToTest, null);
            expect(ctx).to.deep.equal([ctxToTest]);
            done();
        });

        it('should return ctx and errors when there are errors', (done) => {
            const formdata = {
                executors: {errors: error}
            };
            ctxToTest.errors = error;
            const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
            const ctx = addressStep.handleGet(ctxToTest, formdata);
            expect(ctx).to.deep.equal([ctxToTest, error]);
            expect(formdata).to.deep.equal({
                executors: {}
            });
            done();
        });
    });

    describe('handlePost()', () => {
        describe('should return ctx and errors', () => {
            it('when postcodeAddress exists', (done) => {
                ctxToTest = {
                    postcodeAddress: '1 Red Road, London, LL1 1LL',
                    referrer: 'executorApplicant',
                    postcode: 'll1 1ll',
                    addresses: [
                        {address: '1 Red Road, London, LL1 1LL'},
                        {address: '2 Green Road, London, LL2 2LL'}
                    ]
                };
                const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
                const ctx = addressStep.handlePost(ctxToTest, null);
                expect(ctx).to.deep.equal([{
                    address: '1 Red Road, London, LL1 1LL',
                    postcode: 'LL1 1LL',
                    postcodeAddress: '1 Red Road, London, LL1 1LL',
                    addresses: [
                        {address: '1 Red Road, London, LL1 1LL'},
                        {address: '2 Green Road, London, LL2 2LL'}
                    ]
                }, null]);
                done();
            });

            it('when freeTextAddress exists', (done) => {
                ctxToTest = {
                    freeTextAddress: '1 Red Road, London, LL1 1LL',
                    referrer: 'executorApplicant',
                    postcode: 'll1 1ll',
                    addresses: [
                        {address: '1 Red Road, London, LL1 1LL'},
                        {address: '2 Green Road, London, LL2 2LL'}
                    ]
                };
                const addressStep = new AddressStep(steps, section, templatePath, i18next, schema);
                const ctx = addressStep.handlePost(ctxToTest, null);
                expect(ctx).to.deep.equal([{
                    address: '1 Red Road, London, LL1 1LL',
                    postcode: 'LL1 1LL',
                    freeTextAddress: '1 Red Road, London, LL1 1LL'
                }, null]);
                done();
            });
        });
    });
});
