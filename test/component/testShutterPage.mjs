import TestWrapper from '../util/TestWrapper.mjs';

describe('shutter-page', () => {
    let testWrapper;

    beforeEach(async () => {
        testWrapper = await TestWrapper.getInstance('ShutterPage', {ft_caveats_shutter: true});
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
