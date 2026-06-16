import {expect} from 'chai';
import initSteps from '../../app/core/initSteps.js';

const __dirname = import.meta.dirname;

const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const PaymentStatus = steps.PaymentStatus;

describe('PaymentStatus', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = PaymentStatus.constructor.getUrl();
            expect(url).to.equal('/payment-status');
            done();
        });
    });
});
