'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const PaymentBreakdown = steps.PaymentBreakdown;

describe('PaymentBreakDown', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = PaymentBreakdown.constructor.getUrl();
            expect(url).to.equal('/payment-breakdown');
            done();
        });
    });
});
