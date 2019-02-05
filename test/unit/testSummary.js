'use strict';
const Summary = require('app/steps/ui/summary/index');
const expect = require('chai').expect;

describe('Summary', () => {

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Summary.getUrl();
            expect(url).to.equal('/summary/*');
            done();
        });
    });

});
