'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');
const content = require('app/resources/en/translation/thankyou');

describe('thank-you', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('ThankYou');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page when CCD Case ID not present', (done) => {
            const sessionData = {};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        referenceNumber: content.referenceNumber
                    };

                    testWrapper.testContentNotPresent(done, contentData);
                });
        });

        it('test content loaded on the page when CCD Case ID present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: '1234-5678-9012-3456'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: config.helpline.number,
                        findOutNext: config.links.findOutNext
                    };

                    testWrapper.testContent(done, [], contentData);
                });
        });
    });
});
