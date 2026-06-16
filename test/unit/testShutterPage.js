import ShutterPage from '../../app/steps/ui/shutterpage/index.js';
import {expect} from 'chai';

describe('ShutterPage', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ShutterPage.getUrl();
            expect(url).to.equal('/offline');
            done();
        });
    });
});
