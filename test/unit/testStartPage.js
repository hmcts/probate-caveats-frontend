'use strict';

import StartApply from '../../app/steps/ui/startapply/index.js';
import {expect} from 'chai';

describe('startapply/index.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = StartApply.getUrl();
            expect(url).to.equal('/start-apply');
            done();
        });
    });
});
