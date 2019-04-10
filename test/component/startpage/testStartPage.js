'use strict';

const TestWrapper = require('test/util/TestWrapper');

describe('start-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('StartPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            const excludeKeys = [
                'bullet7',
                'paragraph7'
            ];
            testWrapper.testContent(done, excludeKeys);
        });
    });
});
