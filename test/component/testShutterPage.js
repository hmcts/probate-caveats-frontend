'use strict';

const TestWrapper = require('test/util/TestWrapper');

describe('shutter-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('ShutterPage', {ft_caveats_shutter: true});
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the page', (done) => {
            const excludeContent = ['paragraph3'];

            testWrapper.testContent(done, {}, excludeContent);
        });
    });
});
