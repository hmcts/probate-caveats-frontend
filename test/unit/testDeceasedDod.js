'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDod = steps.DeceasedDod;
const content = require('app/resources/en/translation/deceased/dod');

describe('DeceasedDod', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDod.constructor.getUrl();
            expect(url).to.equal('/deceased-dod');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step if there are codicils', (done) => {
            const req = {};
            const ctx = {};
            const nextStepUrl = DeceasedDod.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-dob-known');
            done();
        });
    });

    describe('dateName()', () => {
        it('should return the correct dateName()', (done) => {
            const dateName = DeceasedDod.dateName();
            expect(dateName).to.equal('dod');
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

        it('should return the ctx with the deceased dod', (done) => {
            ctx = {
                dod_day: '02',
                dod_month: '03',
                dod_year: '1952'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                dod_day: '02',
                dod_month: '03',
                dod_year: '1952'
            });
            done();
        });

        it('should return the error for a date in the future', (done) => {
            ctx = {
                dod_day: '02',
                dod_month: '03',
                dod_year: '3000'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    param: 'dod_date',
                    msg: {
                        summary: content.errors.dod_date.dateInFuture.summary,
                        message: content.errors.dod_date.dateInFuture.message
                    }
                }
            ]);
            done();
        });

        it('should return the error for DoD before DoB', (done) => {
            session.form = {
                deceased: {
                    dob_day: '02',
                    dob_month: '03',
                    dob_year: '2002'
                }
            };
            ctx = {
                dod_day: '01',
                dod_month: '01',
                dod_year: '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    param: 'dod_date',
                    msg: {
                        summary: content.errors.dod_date.dodBeforeDob.summary,
                        message: content.errors.dod_date.dodBeforeDob.message
                    }
                }
            ]);
            done();
        });
    });

});
