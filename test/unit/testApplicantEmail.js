'use strict';

const ContactUs = require('app/steps/ui/applicant/email/index');
const expect = require('chai').expect;

describe('email/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ContactUs.getUrl();
            expect(url).to.equal('/applicant-email');
            done();
        });
    });
});
