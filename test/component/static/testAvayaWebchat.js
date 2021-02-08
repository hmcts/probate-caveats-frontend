'use strict';

const TestWrapper = require('test/util/TestWrapper');

describe('avaya webchat', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('AvayaWebchat');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test make sure the avaya webchat is in the content', (done) => {
            testWrapper.testContentPresent(done, ['avayaWebchat']);
        });
    });
});
