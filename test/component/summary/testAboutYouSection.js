'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const applicantData = require('test/data/applicant');
const applicantContent = requireDir(module, '../../../app/resources/en/translation/applicant');
const config = require('app/config');
const basePath = config.app.basePath;

describe('summary-about-you-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = applicantData;
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the summary page about you section, when no data is entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }

                    const playbackData = {};
                    playbackData.name = applicantContent.name.firstName;
                    playbackData.name = applicantContent.name.lastName;
                    playbackData.emailAddress = applicantContent.email.question;
                    playbackData.applicantAddress = applicantContent.address.question;

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the summary page about you section, when section is complete', (done) => {
            testWrapper.agent.post(`${basePath}/prepare-session/form`)
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }

                    const playbackData = {};
                    playbackData.firstName = applicantContent.name.firstName;
                    playbackData.name = applicantContent.name.lastName;
                    playbackData.emailAddress = applicantContent.email.question;
                    playbackData.applicantAddress = applicantContent.address.question;

                    Object.assign(playbackData, applicantData.applicant);

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

    });
});
