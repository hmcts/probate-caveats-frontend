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
});
