import TermsConditions from '../../app/steps/ui/static/terms/index.js';
import {expect} from 'chai';

describe('terms/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = TermsConditions.getUrl();
            expect(url).to.equal('/terms-conditions');
            done();
        });
    });
});
