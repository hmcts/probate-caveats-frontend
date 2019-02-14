'use strict';

const expect = require('chai').expect;
const DeceasedOtherNames = require('app/steps/ui/deceased/othernames/index');

describe('DeceasedOtherNames', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedOtherNames.getUrl();
            expect(url).to.equal('/other-names');
            done();
        });
    });

});
