'use strict';

const ContactUs = require('app/steps/ui/applicant/name/index');
const expect = require('chai').expect;

describe('name/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ContactUs.getUrl();
            expect(url).to.equal('/applicant-name');
            done();
        });
    });
});
