'use strict';

const TestWrapper = require('test/util/TestWrapper');

describe('shutter-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('ShutterPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {});
        });
    });
});
