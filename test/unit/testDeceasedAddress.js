'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedAddress = steps.DeceasedAddress;

describe('DeceasedAddress', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAddress.constructor.getUrl();
            expect(url).to.equal('/deceased-address');
            done();
        });
    });
});
