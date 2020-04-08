'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const BilingualGOP = steps.BilingualGOP;

describe('BilingualGOP', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = BilingualGOP.constructor.getUrl();
            expect(url).to.equal('/bilingual-gop');
            done();
        });
    });
});
