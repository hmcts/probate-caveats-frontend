'use strict';

const TermsConditions = require('app/steps/ui/static/terms/index');
const expect = require('chai').expect;

describe('terms/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = TermsConditions.getUrl();
            expect(url).to.equal('/terms-conditions');
            done();
        });
    });
});
