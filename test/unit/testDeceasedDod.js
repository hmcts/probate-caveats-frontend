'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDod = steps.DeceasedDod;
const content = require('app/resources/en/translation/deceased/dod');

describe('DeceasedDod', () => {
    describe('dateName()', () => {
        it('should return the date names array', (done) => {
            const dateName = DeceasedDod.dateName();
            expect(dateName).to.deep.equal(['dod']);
            done();
        });
    });

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDod.constructor.getUrl();
            expect(url).to.equal('/deceased-dod');
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
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '1952'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '1952'
            });
            done();
        });

        it('should return the error for a date in the future', (done) => {
            ctx = {
                'dod-day': '02',
                'dod-month': '03',
                'dod-year': '3000'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-date',
                    href: '#dod-date',
                    msg: content.errors['dod-date'].dateInFuture
                }
            ]);
            done();
        });

        it('should return the error for DoD before DoB', (done) => {
            session.form = {
                deceased: {
                    'dob-day': '02',
                    'dob-month': '03',
                    'dob-year': '2002'
                }
            };
            ctx = {
                'dod-day': '01',
                'dod-month': '01',
                'dod-year': '2000'
            };
            errors = [];
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dod-date',
                    href: '#dod-date',
                    msg: content.errors['dod-date'].dodBeforeDob
                }
            ]);
            done();
        });
    });
});
