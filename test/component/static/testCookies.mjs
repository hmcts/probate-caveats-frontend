import TestWrapper from '../../util/TestWrapper.mjs';

describe('cookies', () => {
    let testWrapper;

    beforeEach(async () => {
        testWrapper = await TestWrapper.getInstance('Cookies');
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
