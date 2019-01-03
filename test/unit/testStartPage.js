'use strict';

const ContactUs = require('app/steps/ui/startpage/index');
const expect = require('chai').expect;

describe('start/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ContactUs.getUrl();
            expect(url).to.equal('/start-page');
            done();
        });
    });
});
