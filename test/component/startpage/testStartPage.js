'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');

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
            const contentToExclude = [
                'bullet7',
                'paragraph7'
            ];
            const contentData = {applicationFormPA8A: config.links.applicationFormPA8A};

            testWrapper.testContent(done, contentData, contentToExclude);
        });
    });
});
