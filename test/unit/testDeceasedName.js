'use strict';

const expect = require('chai').expect;
const DeceasedName = require('app/steps/ui/deceased/name/index');

describe('DeceasedName', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedName.getUrl();
            expect(url).to.equal('/deceased-name');
            done();
        });
    });

});
