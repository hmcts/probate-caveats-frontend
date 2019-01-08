'use strict';

const expect = require('chai').expect;
const DeceasedDod = steps.DeceasedDod;

describe('DeceasedDod', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedDod.constructor.getUrl();
            expect(url).to.equal('/deceased-dod');
            done();
        });
    });
});
