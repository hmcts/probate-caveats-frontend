'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');

describe('terms-conditions', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('TermsConditions');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            const contentData = {
                privacyLink: config.links.privacy,
                cookiesLink: config.links.cookies,
                helpLineNumber: config.helpline.number,
                helpLineHours: config.helpline.hours,
                callChargesLink: config.links.callCharges
            };

            testWrapper.testContent(done, excludeKeys, contentData);
        });
    });
});
