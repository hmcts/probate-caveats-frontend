'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ApplicantName = steps.ApplicantName;

describe('name/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantName.constructor.getUrl();
            expect(url).to.equal('/applicant-name');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step if there are codicils', (done) => {
            const req = {};
            const ctx = {};
            const nextStepUrl = ApplicantName.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-email');
            done();
        });
    });
});
