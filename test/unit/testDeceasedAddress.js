'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedAddress = steps.DeceasedAddress;
const he = require('he');

describe('DeceasedAddress', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAddress.constructor.getUrl();
            expect(url).to.equal('/deceased-address');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step if there are codicils', (done) => {
            const req = {};
            const ctx = {};
            const nextStepUrl = DeceasedAddress.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/summary/*');
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
            const content = DeceasedAddress.generateContent(ctx, formdata);
            expect(he.decode(content.question)).to.equal(
                'What was the permanent address of Jason Smith?'
            );
            done();
        });
    });
});
