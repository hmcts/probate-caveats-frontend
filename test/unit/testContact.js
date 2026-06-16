import ContactUs from '../../app/steps/ui/static/contact/index.js';
import {expect} from 'chai';

describe('contact/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ContactUs.getUrl();
            expect(url).to.equal('/contact-us');
            done();
        });
    });
});
