import Privacy from '../../app/steps/ui/static/privacy/index.js';
import {expect} from 'chai';

describe('privacy/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Privacy.getUrl();
            expect(url).to.equal('/privacy-policy');
            done();
        });
    });
});
