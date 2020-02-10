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

    describe('isComplete()', () => {
        it('should return the completion status correctly when the Welsh toggle is OFF', (done) => {
            const ctx = {};
            const featureToggles = {
                'welsh_ft': false
            };
            const complete = BilingualGOP.isComplete(ctx, {}, featureToggles);
            expect(complete).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should return the completion status correctly when the Welsh toggle is ON and no language answer given', (done) => {
            const ctx = {};
            const featureToggles = {
                'welsh_ft': true
            };
            const complete = BilingualGOP.isComplete(ctx, {}, featureToggles);
            expect(complete).to.deep.equal([false, 'inProgress']);
            done();
        });

        it('should return the completion status correctly when the Welsh toggle is ON and language answer given', (done) => {
            const ctx = {
                language: {
                    bilingual: 'optionYes'
                }
            };
            const featureToggles = {
                'welsh_ft': true
            };
            const complete = BilingualGOP.isComplete(ctx, {}, featureToggles);
            expect(complete).to.deep.equal([false, 'inProgress']);
            done();
        });
    });
});
