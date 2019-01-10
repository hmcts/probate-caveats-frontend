'use strict';

const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ContactUs = require('app/steps/ui/applicant/name/index');
const expect = require('chai').expect;
const ApplicantName = steps.ApplicantName;
const content = require('app/resources/en/translation/applicant/name');

describe('name/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ContactUs.getUrl();
            expect(url).to.equal('/applicant-name');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        beforeEach(() => {
            session.form = {};
        });

        it('should return the ctx with the allowable characters for first and last name', (done) => {
            ctx = {
                firstName: 'Jason\'s with á, é, í, ó, ú, ý, Á, É, Í, Ó, Ú, Ý; ð, Ð',
                lastName: 'Smith-Jones'
            };
            errors = [];
            [ctx, errors] = ApplicantName.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                firstName: 'Jason\'s with á, é, í, ó, ú, ý, Á, É, Í, Ó, Ú, Ý; ð, Ð',
                lastName: 'Smith-Jones'
            });
            done();
        });

        it('should return the error for a first name that contains numbers', (done) => {
            ctx = {
                firstName: 'Jason5',
                lastName: 'Smith'
            };
            errors = [];
            [ctx, errors] = ApplicantName.validate(ctx, formdata);
            expect(errors).to.deep.equal([
                {
                    param: 'firstName',
                    msg: {
                        summary: content.errors.firstName.invalid.summary,
                        message: content.errors.firstName.invalid.message
                    }
                }
            ]);
            done();
        });

        it('should return the error for a last name that contains numbers', (done) => {
            ctx = {
                firstName: 'Jason',
                lastName: 'Smith3'
            };
            errors = [];
            [ctx, errors] = ApplicantName.validate(ctx, formdata);
            expect(errors).to.deep.equal([
                {
                    param: 'lastName',
                    msg: {
                        summary: content.errors.lastName.invalid.summary,
                        message: content.errors.lastName.invalid.message
                    }
                }
            ]);
            done();
        });

        it('should return the error for a first name that contains special characters', (done) => {
            ctx = {
                firstName: 'Jason[]',
                lastName: 'Smith'
            };
            errors = [];
            [ctx, errors] = ApplicantName.validate(ctx, formdata);
            expect(errors).to.deep.equal([
                {
                    param: 'firstName',
                    msg: {
                        summary: content.errors.firstName.invalid.summary,
                        message: content.errors.firstName.invalid.message
                    }
                }
            ]);
            done();
        });

        it('should return the error for a last name that contains special characters', (done) => {
            ctx = {
                firstName: 'Jason',
                lastName: 'Smith#'
            };
            errors = [];
            [ctx, errors] = ApplicantName.validate(ctx, formdata);
            expect(errors).to.deep.equal([
                {
                    param: 'lastName',
                    msg: {
                        summary: content.errors.lastName.invalid.summary,
                        message: content.errors.lastName.invalid.message
                    }
                }
            ]);
            done();
        });

    });

});
