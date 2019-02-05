'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
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
