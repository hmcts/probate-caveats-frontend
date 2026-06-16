import {expect} from 'chai';
import initSteps from '../../app/core/initSteps.js';

const __dirname = import.meta.dirname;

const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ApplicantAddress = steps.ApplicantAddress;

describe('ApplicantAddress', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantAddress.constructor.getUrl();
            expect(url).to.equal('/applicant-address');
            done();
        });
    });
});
