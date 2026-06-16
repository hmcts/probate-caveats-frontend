import {expect} from 'chai';
import initSteps from '../../app/core/initSteps.js';

const __dirname = import.meta.dirname;

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
