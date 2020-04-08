'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDobKnown = steps.DeceasedDobKnown;
const he = require('he');
const content = require('app/resources/en/translation/deceased/dobknown');

describe('DeceasedDobKnown', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDobKnown.constructor.getUrl();
            expect(url).to.equal('/deceased-dob-known');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedDobKnown.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'dobknown',
                    value: 'optionYes',
                    choice: 'dobknown'
                }]
            });
            done();
        });
    });

    describe('generateContent()', () => {
        it('should replace content varaibles', (done) => {
            const ctx = {};
            const formdata = {
                deceased: {
                    firstName: 'Jason',
                    lastName: 'Smith'
                }
            };
            const content = DeceasedDobKnown.generateContent(ctx, formdata);
            expect(he.decode(content.question)).to.equal(
                'Do you know Jason Smith’s date of birth?'
            );
            done();
        });
    });

    describe('action()', () => {
        it('removes the correct values from the context when the deceased is not known', (done) => {
            let formdata = {};
            let ctx = {
                'dobknown': 'optionNo',
                'dob-date': '1 Mar 1950',
                'dob-day': 1,
                'dob-month': 3,
                'dob-year': 1950,
                'dob-formattedDate': '1 Mar 1950'
            };
            [ctx, formdata] = DeceasedDobKnown.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                'dobknown': 'optionNo',
            });
            done();
        });

        it('removes the correct values from the context when the deceased dob is known', (done) => {
            let formdata = {};
            let ctx = {
                'dobknown': content.optionYes,
                'dob-date': '1 Mar 1950',
                'dob-day': 1,
                'dob-month': 3,
                'dob-year': 1950
            };
            [ctx, formdata] = DeceasedDobKnown.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                'dobknown': content.optionYes,
                'dob-date': '1 Mar 1950',
                'dob-day': 1,
                'dob-month': 3,
                'dob-year': 1950
            });
            done();
        });
    });
});
