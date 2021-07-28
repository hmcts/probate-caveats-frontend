'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const Cookies = steps.Cookies;

describe('Cookies', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Cookies.constructor.getUrl();
            expect(url).to.equal('/cookies');
            done();
        });
    });

    describe('check auth cookie name', () => {
        it('should return the correct url', (done) => {
            expect(Cookies.SECURITY_COOKIE).to.equal('__auth-token-4.1.1');
            done();
        });
    });
});
