'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDob = steps.DeceasedDob;
const content = require('app/resources/en/translation/deceased/dob');

describe('DeceasedDob', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDob.constructor.getUrl();
            expect(url).to.equal('/deceased-dob');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step if there are codicils', (done) => {
            const req = {};
            const ctx = {};
            const nextStepUrl = DeceasedDob.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-alias');
            done();
        });
    });

    describe('dateName()', () => {
        it('should return the correct dateName value', (done) => {
            const dateName = DeceasedDob.dateName();
            expect(dateName).to.equal('dob');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        beforeEach(() => {
            session.form = {
                deceased: {
                    'dod-day': '01',
                    'dod-month': '01',
                    'dod-year': '2000'
                }
            };
        });

        it('should return the ctx with the deceased dob', (done) => {
            ctx = {
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '1952'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '1952'
            });
            done();
        });

        it('should return the error for a date in the future', (done) => {
            ctx = {
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '3000'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    param: 'dob-date',
                    msg: {
                        summary: content.errors['dob-date'].dateInFuture.summary,
                        message: content.errors['dob-date'].dateInFuture.message
                    }
                }
            ]);
            done();
        });

        it('should return the error for a date in the future', (done) => {
            ctx = {
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '3000'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    param: 'dob-date',
                    msg: {
                        summary: content.errors['dob-date'].dateInFuture.summary,
                        message: content.errors['dob-date'].dateInFuture.message
                    }
                }
            ]);
            done();
        });

        it('should return the error for DoD before DoB', (done) => {
            ctx = {
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '2002'
            };
            errors = [];
            [ctx, errors] = DeceasedDob.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    param: 'dob-date',
                    msg: {
                        summary: content.errors['dob-date'].dodBeforeDob.summary,
                        message: content.errors['dob-date'].dodBeforeDob.message
                    }
                }
            ]);
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the deceased date of birth', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}},
                body: {
                    'dob-day': '02',
                    'dob-month': '03',
                    'dob-year': '1952'
                }
            };
            const ctx = DeceasedDob.getContextData(req);
            expect(ctx).to.deep.equal({
                'dob-day': 2,
                'dob-month': 3,
                'dob-year': 1952,
                'dob-date': '1952-03-02T00:00:00.000Z',
                'dob-formattedDate': '2 March 1952',
                'sessionID': 'dummy_sessionId'
            });
            done();
        });
    });
});
