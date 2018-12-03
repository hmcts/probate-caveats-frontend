'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedDod = steps.DeceasedDod;

describe('DeceasedDod', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDod.constructor.getUrl();
            expect(url).to.equal('/deceased-dod');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        let session;
        let hostname;

        it('should return the ctx with the deceased dod', (done) => {
            ctx = {
                dob_day: '02',
                dob_month: '03',
                dob_year: '1952'
            };
            errors = {};
            [ctx, errors] = DeceasedDod.handlePost(ctx, errors, formdata, session, hostname);
            expect(ctx).to.deep.equal({
                dob_day: '02',
                dob_month: '03',
                dob_year: '1952',
            });
            done();
        });
    });
});
