import {expect} from 'chai';
import initSteps from '../../app/core/initSteps.js';

const __dirname = import.meta.dirname;

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
