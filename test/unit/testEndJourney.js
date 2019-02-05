'use strict';

const ContactUs = require('app/steps/ui/endjourney/index');
const expect = require('chai').expect;

describe('endjourney/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ContactUs.getUrl();
            expect(url).to.equal('/end-journey-page');
            done();
        });
    });
});
