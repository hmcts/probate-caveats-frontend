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
});
