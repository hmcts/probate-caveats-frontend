'use strict';

const ContactUs = require('app/steps/ui/stoppage/index');
const expect = require('chai').expect;

describe('stoppage/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ContactUs.getUrl();
            expect(url).to.equal('/stop-page/*');
            done();
        });
    });
});
