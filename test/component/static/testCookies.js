'use strict';

const TestWrapper = require('test/util/TestWrapper');

describe('cookies', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('Cookies');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });
    });
});
