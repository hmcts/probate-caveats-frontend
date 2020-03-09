'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const basePath = config.app.basePath;
const content = require('app/resources/en/translation/thankyou');
const commonContent = require('app/resources/en/translation/common');

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
            const sessionData = {applicant: 'value'};
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
                applicant: {
                    firstName: 'value'
                },
                ccdCase: {
                    id: '1234-5678-9012-3456',
                    state: 'CaseCreated'
                }
            };

            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: commonContent.helpTelephoneNumber,
                        helpLineHours: commonContent.helpTelephoneOpeningHours,
                        citizenAdvice: config.links.citizenAdvice
                    };

                    testWrapper.testContent(done, contentData);
                });
        });
    });
});
