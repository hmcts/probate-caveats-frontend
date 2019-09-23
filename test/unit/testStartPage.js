'use strict';

const StartApply = require('app/steps/ui/startapply/index');
const expect = require('chai').expect;

describe('startapply/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = StartApply.getUrl();
            expect(url).to.equal('/start-apply');
            done();
        });
    });
});
