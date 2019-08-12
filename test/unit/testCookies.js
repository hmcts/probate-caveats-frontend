'use strict';

const Cookies = require('app/steps/ui/static/cookies/index');
const expect = require('chai').expect;

describe('cookies/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Cookies.getUrl();
            expect(url).to.equal('/cookies');
            done();
        });
    });
});
