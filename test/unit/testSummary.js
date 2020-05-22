'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const Summary = steps.Summary;

describe('Summary', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Summary.constructor.getUrl();
            expect(url).to.equal('/summary');
            done();
        });
    });
});
