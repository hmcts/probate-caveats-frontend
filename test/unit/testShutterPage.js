'use strict';

const ShutterPage = require('app/steps/ui/shutterpage');
const expect = require('chai').expect;

describe('ShutterPage', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ShutterPage.getUrl();
            expect(url).to.equal('/offline');
            done();
        });
    });
});
