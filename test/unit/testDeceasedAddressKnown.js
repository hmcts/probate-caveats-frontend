'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedAddressKnown = steps.DeceasedAddressKnown;
const he = require('he');

describe('DeceasedAddressKnown', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAddressKnown.constructor.getUrl();
            expect(url).to.equal('/deceased-address-known');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedAddressKnown.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'addressknown',
                    value: 'Yes',
                    choice: 'addressknown'
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
            const content = DeceasedAddressKnown.generateContent(ctx, formdata);
            expect(he.decode(content.question)).to.equal(
                'Do you know what Jason Smith’s permanent address was?'
            );
            done();
        });
    });

});
