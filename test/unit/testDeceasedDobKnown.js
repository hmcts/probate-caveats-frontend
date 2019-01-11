'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDobKnown = steps.DeceasedDobKnown;

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
                    value: 'Yes',
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
            expect(content.question).to.equal(
                'Do you know Jason Smith\'s date of birth?'
            );
            done();
        });
    });

});
