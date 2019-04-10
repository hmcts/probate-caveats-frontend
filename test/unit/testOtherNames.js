'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedOtherNames = steps.DeceasedOtherNames;

describe('DeceasedOtherNames', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedOtherNames.constructor.getUrl();
            expect(url).to.equal('/other-names');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step if there are codicils', (done) => {
            const req = {};
            const ctx = {};
            const nextStepUrl = DeceasedOtherNames.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-address');
            done();
        });
    });
});
