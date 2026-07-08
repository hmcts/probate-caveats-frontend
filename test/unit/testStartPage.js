'use strict';

const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const StartApply = steps.StartApply;
const expect = require('chai').expect;

describe('startapply/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = StartApply.constructor.getUrl();
            expect(url).to.equal('/start-apply');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return true when the ft_probate-fee-increase_2026 toggle is set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {
                ft_probate_fee_increase_2026: true
            };
            const [ctx] = StartApply.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.applicationFee).to.equal(4);
            done();
        });

        it('should return true when the ft_probate-fee-increase_2026 toggle is false', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {
                ft_probate_fee_increase_2026: false
            };
            const [ctx] = StartApply.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.applicationFee).to.equal(3);
            done();
        });

        it('should return false when the ft_probate-fee-increase_2026 toggle is not set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {};
            const [ctx] = StartApply.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.applicationFee).to.equal(3);
            done();
        });
    });
});
