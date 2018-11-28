'use strict';

const Privacy = require('app/steps/ui/privacy/index');
const expect = require('chai').expect;

describe('privacy/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Privacy.getUrl();
            expect(url).to.equal('/privacy-policy');
            done();
        });
    });
});
