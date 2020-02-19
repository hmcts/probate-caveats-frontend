'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ApplicantEmail = steps.ApplicantEmail;

describe('email/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantEmail.constructor.getUrl();
            expect(url).to.equal('/applicant-email');
            done();
        });
    });
});
