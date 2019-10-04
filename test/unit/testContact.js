'use strict';

const ContactUs = require('app/steps/ui/static/contact/index');
const expect = require('chai').expect;

describe('contact/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ContactUs.getUrl();
            expect(url).to.equal('/contact-us');
            done();
        });
    });
});
