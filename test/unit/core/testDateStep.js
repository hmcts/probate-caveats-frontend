'use strict';

const expect = require('chai').expect;
const DateStep = require('app/core/steps/DateStep');
const sinon = require('sinon');
const i18next = require('i18next');

describe('DateStep', () => {
    const steps = {};
    const section = 'deceased';
    const resourcePath = 'deceased/dod';
    const schema = require('app/steps/ui/deceased/dod/schema');
    const language = 'en';
    const dateStep = new DateStep(steps, section, resourcePath, i18next, schema, language);

    describe('dateName()', () => {
        it('should return null', (done) => {
            const dateName = dateStep.dateName();

            expect(dateName).to.equal(null);
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct ctx with a parsed date', (done) => {
            const req = {
                session: {
                    language: 'en',
                    form: {
                        deceased: {
                            'firstName': 'Dee',
                            'lastName': 'Ceased',
                            'dod-day': '4',
                            'dod-month': '6',
                            'dod-year': '2018'
                        }
                    }
                }
            };
            const parseDateStub = sinon.stub(dateStep, 'parseDate').returns({
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dod-day': 4,
                'dod-month': 6,
                'dod-year': 2018,
                'dod-date': '2018-06-04T23:00:00.000Z',
                'dod-formattedDate': '4 June 2018'
            });
            const dateNameStub = sinon.stub(dateStep, 'dateName').returns(['dod']);
            const ctx = dateStep.getContextData(req);

            expect(ctx).to.deep.equal({
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dod-day': 4,
                'dod-month': 6,
                'dod-year': 2018,
                'dod-date': '2018-06-04T23:00:00.000Z',
                'dod-formattedDate': '4 June 2018'
            });
            parseDateStub.restore();
            dateNameStub.restore();
            done();
        });
    });

    describe('parseDate()', () => {
        it('should parse an invalid date and store it in the context as null', (done) => {
            const dateNames = ['dod'];
            const testCtx = {
                'dod-day': '4',
                'dod-month': '6',
                'dod-year': '2018'
            };
            const ctx = dateStep.parseDate(testCtx, dateNames, 'en');
            expect(ctx).to.deep.equal({
                'dod-day': 4,
                'dod-month': 6,
                'dod-year': 2018,
                'dod-date': '2018-06-04T00:00:00.000Z',
                'dod-formattedDate': '4 June 2018'
            });
            done();
        });

        it('should parse a valid date and store it in the context', (done) => {
            const dateNames = ['dod'];
            const testCtx = {
                'dod-day': '4',
                'dod-month': '6',
                'dod-year': '2018'
            };
            const ctx = dateStep.parseDate(testCtx, dateNames, 'en');
            expect(ctx).to.deep.equal({
                'dod-day': 4,
                'dod-month': 6,
                'dod-year': 2018,
                'dod-date': '2018-06-04T00:00:00.000Z',
                'dod-formattedDate': '4 June 2018'
            });
            done();
        });
    });
});
