import {expect} from 'chai';
import initSteps from '../../app/core/initSteps.js';

const __dirname = import.meta.dirname;

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

    describe('nextStepUrl()', () => {
        it('should return the url from context if paymentNextUrl set', (done) => {
            const paymentUrl = 'payment-url';
            const ctx = {
                paymentNextUrl: paymentUrl,
            };

            const url = PaymentBreakdown.nextStepUrl(ctx);
            expect(url).to.equal(paymentUrl);
            done();
        });

        it('should return /payment-status if paymentNextUrl not set in ctx', (done) => {
            const ctx = {};

            const url = PaymentBreakdown.nextStepUrl(ctx);
            expect(url).to.equal('/payment-status');
            done();
        });
    });
});
